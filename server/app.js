
const http = require('http');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const firebase = require('firebase');


var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
require('dotenv').load();

const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const app = express();

// phoneMessages cont;ains the entire list of messages and phone numbers associated 
var phoneMessages = {};

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCctjM4-V60XuK387-ovoTE3UaOhiW-JoQ",
  authDomain: "impekable-chat-project.firebaseapp.com",
  databaseURL: "https://impekable-chat-project.firebaseio.com",
  projectId: "impekable-chat-project",
  storageBucket: "impekable-chat-project.appspot.com",
  messagingSenderId: "724217898399"
};
firebase.initializeApp(config);

//reference to database service
var database = firebase.database();

app.use(bodyParser.urlencoded({extended: false }));

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
});

app.post('/send', (req, res) => {
  let myNumber = '+15153258366';

  client.messages.create({
      body: req.body.message,
      from: myNumber,
      to: req.body.to,
  })
  .then((message) => {
    res.json(message);
    console.log(message.from);
    processMessage(message);
  })
  .done();

  //add the message to firebase
  function processMessage(message) {
    var newMessageData = {};
    var receivingNum = message.to;
    newMessageData[myNumber] = message.body;

    var ref =database.ref('/messages');
    ref.child(receivingNum).once("value", snapshot => {

        if(!snapshot.exists()) {
          ref.child(receivingNum).set(0);
        }
          var newMessageKey = ref.child(receivingNum).push().key;
          var updates = {};

          updates['/messages/' + receivingNum + '/' + newMessageKey] = newMessageData;
          database.ref().update(updates);
    });

  }
}) 


// get messages from an actual phone number and send to call center
app.post('/receive', (req, res)=> {
  
  let incomingNum = req.body.From;

  var newMessageData = {};
  newMessageData[incomingNum] = req.body.Body;


  var ref = database.ref('/messages');
  ref.child(incomingNum).once("value", snapshot => {
    //if the number isn't in the list of messages, add it
    if(!(snapshot.exists())) {
      //set the incoming number key first
      ref.child(incomingNum).set(0);
    }
    //add the message
    var newMessageKey = ref.child(incomingNum).push().key;
    var updates = {};

    updates['/messages/' + incomingNum + '/' + newMessageKey] = newMessageData;
    database.ref().update(updates);
  });

});

app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})

