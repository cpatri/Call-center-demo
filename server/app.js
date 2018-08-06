const http = require('http');
const express = require('express');
const util = require('util');
const bodyParser = require('body-parser');

var ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const twilio = require('twilio');
const MessagingResponse = twilio.TwimlResponse.MessagingResponse;

const client = new twilio(ACCOUNT_SID, authToken);

