
const http = require('http');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');
const basicAuth = require('express-basic-auth');
const twilio = require('twilio');

require('dotenv').load();

// Twilio Account information to config Twilio API calls
var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var TWILIO_TWIML_APP_SID = process.env.TWILIO_TWIML_APP_SID;
var ADMIN_USER = process.env.ADMIN_USER;
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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

//Create Basic Auth to login into the UI
var challengeAuth = basicAuth({
  authorizer: myAuthorizer,
  challenge: true
})

function myAuthorizer(username, password) {
  return username===ADMIN_USER && password===ADMIN_PASSWORD;
}

app.use(bodyParser.urlencoded({extended: false }));

// parse application/json
app.use(bodyParser.json())

/**
 * Webhooks for connected to Twilio API and Firebase 
*/

// test route
app.get('/api/', (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
});

/**
 * post request to '/api/send' is made when the call center employee 
 * sends a message to the customer through the input bar in the MiddlePageChat container.
 * This webhook first sends the text message to the customer via Programmable SMS API
 * and then stores the message into Firebase Realtime Database in the format:
 * {
 *  number: +1xxxxxxxxxx,
 *  timestamp: xxxxxxxx,
 *  message: 'xxxx'
 * }
 * where number is the Twilio number registered under the Call center employee
 * It's first stored under a node called messages which contains a list of customer phone numbers. 
 * The message is appended to the customer's phone number list of messages.
 * The message is also appended to the lastMessages node which updates with this info under that 
 * customer's phone number.
 */

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

/**
 * a post request to /api/receive is made when a customer sends a text message to the 
 * call center employee's twilio phone number 
 * 
 * it stores the text message in the same format as above into the messages 
 * and lastMessage node in Firebase and calls TwilioLookup API to look up info on the
 * customer's number: name, country, state, city, and caller type
 */

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

/**
 * Generate a Capability Token for a Twilio Client user 
 * in order to make phone calls and listen for incoming calls
 * it lasts for 1 hour
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

/**
 * a post request to /api/voice is made when the call center employee is making 
 * an outgoing call to a customer; uses twiml and Twilio's api
 */
app.post('/api/voice', function (req, res) {
  console.log(req);
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

//sets up the middleware for auth and serve a static file for the UI (client)
app.use('/', challengeAuth, express.static(path.join(__dirname, '../client/build')));

app.listen(process.env.PORT || 3003, () => {
  console.log("Server is up and listening on 3003...")
});
