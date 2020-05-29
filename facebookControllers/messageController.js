const request = require('request');
const { getServiceMessage } = require("../Controllers/sessionController.js");


const handleMessage = async (sender_psid, received_message) => {

    // Gets response from Watson
    const serviceReply = await getServiceMessage(received_message.text);
    console.log(serviceReply);
    console.log('here to test FB');
    let response;

    // Sends the response message
    JSON.parse(serviceReply).output.generic.forEach(async (generic) => {
        // if (generic.text) {
        //     await response = {
        //         "text": generic.text,
        //     };
        // }
        // if (generic.options) {
        //     await response = {
        //         "text": generic.text,
        //         "quick_replies":[
        //             {
        //                 "content_type":"text",
        //                 "title":"Red",
        //                 "payload":"Good looking out red",
        //                 "image_url":"http://example.com/img/red.png"
        //             },
        //             {
        //                 "content_type":"text",
        //                 "title":"Green",
        //                 "payload":"Good looking out Green",
        //                 "image_url":"http://example.com/img/green.png"
        //             }
        //         ]
        //     };
        // }
        response = {
            "text": generic.text,
            "quick_replies": [
                        {
                            "content_type":"text",
                            "title":"Red",
                            "payload":"Good looking out red",
                            "image_url":"http://example.com/img/red.png"
                        },
                        {
                            "content_type":"text",
                            "title":"Green",
                            "payload":"Good looking out Green",
                            "image_url":"http://example.com/img/green.png"
                        }
                    ]
        };
        console.log(response);
        // const qr = getQuickReplies(generic.options);
        // console.log(qr);
        await callSendAPI(sender_psid, response);
    });
};

const handlePostBack = () => {};

const getQuickReplies = async (options) => {
    const response = [];
    await options.forEach((optionObject) => {
        response.push(
            {
                "content_type":"text",
                "title": optionObject.label,
                "payload": optionObject.value.input.text,
            },
        );
    });
    console.log('testing getQR');
    console.log(response);
    return response;
};

const callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
            console.log('--------------------------');
            console.log(body)
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = {
    handleMessage, handlePostBack
};
