
const http = require('http');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');

var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID;


require('dotenv').load();

const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const MessagingResponse = twilio.twiml.MessagingResponse;
const VoiceResponse = twilio.twiml.VoiceResponse;

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

const app = express();

// Initialize Firebase
var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
}
firebase.initializeApp(config);

//reference to database service
var database = firebase.database();

app.use(bodyParser.urlencoded({extended: false }));

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next ) => {
      // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use('/', express.static(path.join(__dirname, '../client/build')));

app.get('/api/', (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
});

app.post('/api/send', (req, res) => {
  let myNumber = process.env.TWILIO_CALLER_ID;

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

  function processMessage(message) {
    var receivingNum = message.to;
    var newMessageData = {
      number: message.from,
      timestamp: Date.now(),
      message: message.body
    };
 

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

    var lastMesssagesRef = database.ref('/lastMessages');

    lastMesssagesRef.child(receivingNum).once("value", snapshot => {
      if(!snapshot.exists()) {
        lastMesssagesRef.child(receivingNum).set(newMessageData);
      }
      var updates = {};
      updates['/lastMessages/'+ receivingNum] = newMessageData;
      database.ref().update(updates);
    });

  }
}) 

// get messages from an actual phone number and send to call center
app.post('/api/receive', (req, res)=> {
  
  let incomingNum = req.body.From;

  var newMessageData = {
    number: incomingNum,
    timestamp: Date.now(),
    message: req.body.Body
  };

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

  var lastMesssagesRef = database.ref('/lastMessages');

  lastMesssagesRef.child(incomingNum).once("value", snapshot => {
    if(!(snapshot.exists())) {
      lastMesssagesRef.child(incomingNum).set(newMessageData);
    }
    var updates = {};
    updates['/lastMessages/'+ incomingNum] = newMessageData;
    database.ref().update(updates);

  });

  var notesRef = database.ref('/notes');
  notesRef.child(incomingNum).once('value', snapshot => {
    if(!(snapshot.exists())) {
      notesRef.child(incomingNum).set('');
    }
  })


  client.lookups.phoneNumbers(incomingNum)
    .fetch({type: 'caller-name'})
    .then(phone_number => {
      addCustomerInfo(phone_number)
    })
    .done();
  
  function addCustomerInfo(phoneNumber) {
    var customerName = phoneNumber.callerName.caller_name ? phoneNumber.callerName.caller_name : 'Name not available';
    var callerType = phoneNumber.callerName.caller_type ? phoneNumber.callerName.caller_type : 'Caller type not available';
    var newCustomerInfo = {
      name: customerName,
      callerType: callerType,
      country: req.body.FromCountry,
      state: req.body.FromState,
      city: req.body.FromCity,
      zipcode: req.body.FromZip,
    }
    
    var customerInfoRef = database.ref('/customerInfo');
    customerInfoRef.child(incomingNum).once("value", snapshot => {
      if(!(snapshot.exists())) {
        customerInfoRef.child(incomingNum).set(newCustomerInfo);
      }
    })
  }
});


/*
Generate a Capability Token for a Twilio Client user - it generates a random
username for the client requesting a token.
*/
app.get('/api/token', (req, res) => {
  const capability = new ClientCapability( {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  }); 

  capability.addScope(
    new ClientCapability.OutgoingClientScope({ applicationSid: process.env.TWILIO_TWIML_APP_SID})
  );
  capability.addScope(new ClientCapability.IncomingClientScope('caroline'));
  const token = capability.toJwt();

  res.set('Content-Type', 'application/jwt');
  res.send(token);
});

app.post('/api/voice', function (req, res) {
  console.log(req.body.To);
  const twiml  = new VoiceResponse();
  if (req.body.To) {
    const dial = twiml.dial({callerId: process.env.TWILIO_CALLER_ID});
    dial.number(req.body.To); 
  } else {
    twiml.say("Thanks for calling");
  }
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});

app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
});