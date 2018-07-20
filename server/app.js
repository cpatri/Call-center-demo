'use strict';

//require('dotenv-safe').load();

const express = require('express')
const init = require('./simplecontent/init')

const app = express()

app.get("/", (req, res) => {
  console.log("Responding to root route")
  init()
  res.send("Hello from ROOT")
})

app.get("/users", (req, res) => {
  var user1 = {firstName: "Stephen", lastName: "Curry"}
  const user2 = {firstName: "Kevin", lastName: "Durrant"}
  res.json([user1,user2])
  // res.send("Nodemon auto updates when I save this file")
})


app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})
