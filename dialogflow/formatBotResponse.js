const { cards, texts, quickReplies } = require('../dialogflow/messageComponents');

const getFormattedBotResponse = (result, botResponse) => {

    result.fulfillmentMessages.forEach((fulfillmentMessageObject) => {

        // check if PLATFORM_UNSPECIFIED has a text in PLATFORM: FACEBOOK
        // if yes, do not add to botResponse
        if (fulfillmentMessageObject.platform === 'PLATFORM_UNSPECIFIED') {

            if (fulfillmentMessageObject.text.text[0] === '') return;
            if (botResponse.length) {
                return botResponse.forEach((botMessageObject) => {
                    if (botMessageObject.text === fulfillmentMessageObject.text.text[0]) {}
                });
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

    });

};

module.exports = {
    getFormattedBotResponse,
};
