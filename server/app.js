
const http = require('http');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');

var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
require('dotenv').load();

const twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const app = express();

var phoneMessages = {};

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
    processMessage(message);
  })
  .done();

  function processMessage(message) {
    var newMessage = {};
    newMessage.me = true;
    newMessage.message = message.body;

    console.log('message.to: ', message.to);
    if (!(phoneMessages.hasOwnProperty(message.to))) {
      var messageList = [];
      messageList.push(newMessage);
      phoneMessages[message.to] = messageList;
    }
    else {
      phoneMessages[message.to].push(newMessage);
    }
    console.log('phoneMessages: ', phoneMessages);
  }
});


app.post('/receive', (req, res) => {

  let newMessage = {};
  newMessage.me = false;
  newMessage.message = req.body.Body;

  let incomingNum = req.body.From;
  console.log('incomingNum: ', incomingNum);
  // if the phone number doesn't exist in the list, add it 
  if (!(phoneMessages.hasOwnProperty(incomingNum))) {
    let messageList = [];
    messageList.push(newMessage);
    phoneMessages[incomingNum] = messageList;
  }
  // else, just append the message to the MessageList
  else {
    phoneMessages[incomingNum].push(newMessage);
  }

  console.log('phoneMessages: ', phoneMessages);
});


app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})
