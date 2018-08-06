
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

let messageList = [];

app.use(bodyParser.urlencoded({extended: false }));

app.get('/', (req, res) => {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
})


app.post('/inbound-sms', (req, res) => {
  const twiml = new MessagingResponse();
  messageList.push(req.body.Body);
  console.log(messageList);

  res.writeHead(200, { 'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})
