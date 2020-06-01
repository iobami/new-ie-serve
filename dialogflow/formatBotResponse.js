const { cards, texts, links, quickReplies } = require('../dialogflow/messageComponents');

const getFormattedBotResponse = (result, botResponse) => {

    function duplicateText(botResponse, query) {
        return botResponse.filter(response => !(response.text === query));
    }

    // result.fulfillmentMessages.forEach((fulfillmentMessageObject) => {
    //
    //
    //
    // });

    for (const fulfillmentMessageObject of result.fulfillmentMessages) {

        // check if PLATFORM_UNSPECIFIED has a text in PLATFORM: FACEBOOK
        // if yes, do not add to botResponse
        if (fulfillmentMessageObject.platform === 'PLATFORM_UNSPECIFIED') {

            if (fulfillmentMessageObject.message === 'payload') {
                const {
                    message: {
                        stringValue: messageType,
                    },
                } = fulfillmentMessageObject.payload.fields;

                if (messageType === 'link') {
                    const { listValue } = fulfillmentMessageObject.payload.fields.text.structValue.fields.text;
                    const link = listValue.values[0].stringValue;

                    const formattedText = [
                        link,
                    ];
                    const text = links({ text: formattedText });
                    botResponse.push(text);
                }

            } else {
                if (fulfillmentMessageObject.text.text[0] === '') return;
                if (botResponse.length) {

                    botResponse = duplicateText(botResponse, fulfillmentMessageObject.text.text[0]);

                }
            }

        }

        // if bot response contains text call text function and add text
        if (fulfillmentMessageObject.message === 'text') {
            const text = texts(fulfillmentMessageObject.text);
            botResponse.push(text);
        }

        // if bot response contains cards call card function and add card
        if (fulfillmentMessageObject.message === 'card') {
            const card = cards(fulfillmentMessageObject.card);
            botResponse.push(card);
        }

        // if bot response contains quickreplies call quickreply function and add quickreply
        if (fulfillmentMessageObject.message === 'quickReplies') {
            if (fulfillmentMessageObject.quickReplies.title) {
                if (fulfillmentMessageObject.quickReplies.title === '') return;
                const formattedText = [
                    fulfillmentMessageObject.quickReplies.title,
                ];
                const text = texts({ text: formattedText });
                botResponse.push(text);
            }
            const quickreply = quickReplies(fulfillmentMessageObject.quickReplies);
            botResponse.push(quickreply);
        }

        if (fulfillmentMessageObject.message === 'payload') {
            const { facebook } = fulfillmentMessageObject.payload.fields;
            const {
                structValue: {
                    fields: {
                        attachment: {
                            structValue: {
                                fields: {
                                    payload: payload,
                                    type: type,
                                }
                            }
                        }
                    }
                }
            } = facebook;

            const {
                structValue: {
                    fields: {
                        text: {
                            structValue: {
                                fields: {
                                    text: {
                                        listValue: {
                                            values: [
                                                {
                                                    stringValue: url
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            } = payload;

            if (type.stringValue === 'link') {

                const formattedText = [
                    url,
                ];
                const text = links({ text: formattedText });
                botResponse.push(text);
            }
        }

    }
    return botResponse;

};

module.exports = {
    getFormattedBotResponse,
};
