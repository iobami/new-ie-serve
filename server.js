const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require('cors');
const app = express().use(bodyParser.json());

app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { startSession } = require("./Controllers/sessionController.js");
const { handleMessage, handlePostBack } = require("./facebookControllers/messageController.js");


const port = process.env.PORT || 5001;

const { createSocketConnection } = require('./connector/socket');

// Get session id for watson
startSession();
// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach( async function(entry) {

            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(webhook_event.sender.id, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostBack(webhook_event.sender.id, webhook_event.postback);
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.eMessage(webhook_event.message.text);
    let VERIFY_TOKEN = process.env.WEBHOOK_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

setInterval(function() {
    app.get("https://ui-bot-1.herokuapp.com");
}, 300000);

// createClient();
createSocketConnection(io);

http.listen(port, () => console.log(`Example app listening on port ${port}!`));
