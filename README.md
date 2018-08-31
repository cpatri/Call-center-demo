# Call Center Demo

Live Demo Link: https://murmuring-beyond-65400.herokuapp.com/
To get credentials for the demo, contact Caroline directly since Twilio's API usage isn't free. 

This call center dashboard demo was designed and developed during my front-end engineering internship with Impekable from July to August 2018.

It utilizes HTML, CSS, Javascript, React.js, Goldenlayout.js, Redux, Node.js, express, and Twilio APIs including Programmable SMS, Programmable Voice, Client, and Lookup.

This call center demo is in the perspective of a single call center employee. He/she will see a list of phone numbers of customers who have contacted this employee on the left of the screen with the most recent message seen below the phone number. In the middle container, the call center employee can text directly to the customer through the chat window. In the right container, the call center employee can see any publicly available information about the customer including name, country, state, city, etc. given by Twilio's Lookup API. The call center employee can also directly call the phone number from the dashboard and take notes during the conversation. The demo is also capable of receiving an incoming call to the Twilio phone number assigned to the call center employee. An incoming call notification is should through a modal that appears on the screen when the call is made.

This project was made using GoldenLayout.js so the three containers can also be moved around for the call center employee's preference. 

The demo project will serve as a basis for a larger project at Impekable which will design an entire call center using Twilio's Taskrouter.

## Getting Started

### 1. Download the project 
Route into the server folder and run `npm init`. Route into the client folder and do the same thing. 

The project isn't going to be function yet.

### 2. Create a Firebase project 
Do so at https://firebase.google.com/. It's free.

Name the project whatever you want. Once in the Firebase console for the project, get the project's config information which looks like

```
<script src="https://www.gstatic.com/firebasejs/5.4.1/firebase.js"></script>
<script>
  // Initialize Firebase
  // TODO: Replace with your project's customized code snippet
  var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };
  firebase.initializeApp(config);
</script>

```
In `index.html`, replace the config info with your own and with `.env` file add the `API_KEY`, `AUTH_DOMAIN`, `DB_URL`, `PROJECT_ID`, `STORAGE_BUCKET`, and `MESSAGING_SENDER_ID` information as needed. 

### 3. Get a Twilio account 
Here: https://www.twilio.com/
You'll need a Twilio phone number. You can pay or play Twilio Quest Getting Started to get some starting money: https://www.twilio.com/quest/. 

In `.env` add in your Twilio credentials and twilio phone number. `TWILIO_TWIML_APP_SID` is set up in a later step.


### 4. Set up credentials
In `.env` set up your username and password for the project. 

### 5. Install ngrok (if necessary)
Do it here: https://ngrok.com/

### 6. Set up your TwiML Bin for your Twilio Client to make calls
Within the Twilio console, go to RunTime and set up a TwiML bin and give it a friendly name and put the following TwiML: 
```
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Dial>
    <Client>caroline</Client>
  </Dial>
</Response>

```
### 7. Launch the project
Route into the client folder and run `npm start`. 
In another window, route into the server folder and run `nodemon app.js`.
In a third window, run `ngrok http 8080 --host-header=localhost`.

Go to your Twilio Console and click the phone number you plan to use as your call center employee's number.
Under 'voice & fax' make sure the number is configured to accept incoming `voice calls` and configures with `Webhooks, TwiML Bins, Functions, Studio, or Proxy`. Under 'a call comes in', select the friendly name from step 6.

Then under messaging, make sure it's configured with `Webhooks, TwiML Bins, Functions, Studio, or Proxy` and for 'a message comes in', select `Webhook`. The URL will be `https://username:password@abc123ngrok.io/api/receive` where the username and password were the ones set in step 4 and abc123 should be replaced with the letter-number combination from when you ran `ngrok http 8080 --host-header=localhost`. 

Under 'Manage Numbers' in the Twilio console, click on 'Tools' and create a TwiML app. Under request url, put `https://username:password@abc123ngrok.io/api/voice` and replace where necessary.

Take the SID from that TwiML app and put in your .env file under `TWILIO_TWIML_APP_SID`. 

Now your project should be working. 