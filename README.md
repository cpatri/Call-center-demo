# Call Center Demo

This call center dashboard demo was designed and developed during my front-end engineering internship with Impekable from July to August 2018.

It utilizes HTML, CSS, Javascript, React.js, Goldenlayout.js, Redux, Node.js, express, and Twilio APIs including Programmable SMS, Programmable Voice, Client, and Lookup.

This call center demo is in the perspective of a single call center employee. He/she will see a list of phone numbers of customers who have contacted this employee on the left of the screen with the most recent message seen below the phone number. In the middle container, the call center employee can text directly to the customer through the chat window. In the right container, the call center employee can see any publicly available information about the customer including name, country, state, city, etc. given by Twilio's Lookup API. The call center employee can also directly call the phone number from the dashboard and take notes during the conversation. The demo is also capable of receiving an incoming call to the Twilio phone number assigned to the call center employee. An incoming call notification is should through a modal that appears on the screen when the call is made.

This project was made using GoldenLayout.js so the three containers can also be moved around for the call center employee's preference. 

The demo project will serve as a basis for a larger project at Impekable which will design an entire call center using Twilio's Taskrouter.