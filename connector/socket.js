const { getDialogFlowResponse } = require('../dialogflow/getBotResponse');
const { cards, texts, quickReplies } = require('../dialogflow/messageComponents');
const { buManagersIntent } = require('../dialogflow/intents/BU Managers');
const { checkBills } = require('../dialogflow/intents/check bills');
const { checkPayment } = require('../dialogflow/intents/check payment history');

const createSocketConnection = (io) => {
    io.on('connection', async function(socket){

        console.log('a user connected ', socket.id);
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('chat', function (msg) {

            const message = async () => {
                // const userMessage = 'Hey, I speak Eng';
                const result = await getDialogFlowResponse(process.env.PROJECT_ID, msg, socket.id);

                if (result.intent) {
                    console.log(`  Intent: ${result.intent.displayName}`);
                } else {
                    console.log(`  No intent matched.`);
                }

                console.log('--------------hello-----------+++++++++++++++++++++');

                const botResponse = [];

                console.log(result.action);

                let billDate = '';
                let accountNumber = '';
                let fields;
                let account_no;

                switch (result.action) {
                    case 'specifiedBU':

                        buManagersIntent(result, botResponse);

                        break;

                    case 'pay.bills':

                        const textArray = [
                            'In order to pay bills on the mobile or web app, here are steps to follow: ',
                            '1. On the home page, Click on Bills and Payments. ',
                            '2. Under the pay bills, select the party you are paying the bills for.',
                            '3. Select the payment option, if you will be using Card or Pin',
                            '4. Enter your meter number',
                            '5. Enter the amount you want to pay',
                            '6. Enter your email address.',
                            '7. Click on Make payments.',
                        ];

                        await textArray.forEach((textObject) => {

                            const formattedText = [
                                textObject,
                            ];
                            const text = texts({ text: formattedText });
                            botResponse.push(text);
                        });

                        break;

                    case 'customer.previous.payment':

                        if (!result.parameters.fields) return;
                        ({ fields } = result.parameters);
                        if (!fields) return;

                        ({ account_no } = fields);

                        billDate = 'previous';
                        accountNumber = account_no.stringValue;

                        if ((billDate && accountNumber) !== '') {
                            const response = await checkPayment(accountNumber, billDate);
                            if (response.length) {
                                await response.forEach((textObject) => {
                                    botResponse.push(textObject);
                                });
                            }
                        }

                        break;

                    case 'customer.last.payment':

                        if (!result.parameters.fields) return;
                        ({ fields } = result.parameters);
                        if (!fields) return;

                        ({ account_no } = fields);

                        billDate = 'current';
                        accountNumber = account_no.stringValue;

                        if ((billDate && accountNumber) !== '') {
                            const response = await checkPayment(accountNumber, billDate);
                            if (response.length) {
                                await response.forEach((textObject) => {
                                    botResponse.push(textObject);
                                });
                            }
                        }

                        break;

                    case 'getPaymentHistory':

                        if (!result.parameters.fields) return;
                        ({ fields } = result.parameters);
                        if (!fields) return;

                        ({ AccountNumber: account_no, billtype: billDate } = fields);

                        billDate = billDate.stringValue;
                        accountNumber = account_no.stringValue;

                        if ((billDate && accountNumber) !== '') {
                            const response = await checkPayment(accountNumber, billDate);
                            if (response.length) {
                                await response.forEach((textObject) => {
                                    botResponse.push(textObject);
                                });
                            }
                        } else {

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

                                    // if bot response contains text call text function and add text
                                    if (fulfillmentMessageObject.message === 'text') {
                                        const text = texts(fulfillmentMessageObject.text);
                                        botResponse.push(text);
                                    }

                                }
                            });
                        }

                        break;

                    case 'customer.previous.bill':

                        if (!result.parameters.fields) return;
                        ({ fields } = result.parameters);
                        if (!fields) return;
                        ({ account_no } = fields);

                        billDate = 'previous';
                        accountNumber = account_no.stringValue;

                        // if both fields are available get bill history
                        if ((billDate && accountNumber) !== '') {
                            const response = await checkBills(accountNumber, billDate);
                            if (response.length) {
                                await response.forEach((textObject) => {
                                    botResponse.push(textObject);
                                });
                            }
                        }

                        break;

                    case 'customer.current.bill':

                        if (!result.parameters.fields) return;
                        ({ fields } = result.parameters);
                        if (!fields) return;
                        ({ account_no } = fields);

                        billDate = 'current';
                        accountNumber = account_no.stringValue;

                        // if both fields are available get bill history
                        if ((billDate && accountNumber) !== '') {
                            const response = await checkBills(accountNumber, billDate);
                            if (response.length) {
                                await response.forEach((textObject) => {
                                    botResponse.push(textObject);
                                });
                            }
                        }

                        break;

                    default:

                        if (result.intent.displayName === 'Check Bills') {

                            // if there's no field object return
                            if (!result.parameters.fields) return;
                            const { fields } = result.parameters;
                            if (!fields) return;
                            const { CurrentOrPrevBill, AccountNumber } = fields;
                            const billDate = CurrentOrPrevBill.stringValue;
                            const accountNumber = AccountNumber.stringValue;

                            // if both fields are available get bill history
                            if ((billDate && accountNumber) !== '') {
                                const response = await checkBills(accountNumber, billDate);
                                if (response.length) {
                                    await response.forEach((textObject) => {
                                        botResponse.push(textObject);
                                    });
                                }
                            }
                        }

                        // check if fulfillmentMessages exist and loop through
                        if (result.fulfillmentMessages) {
                            // console.log(JSON.stringify(result.fulfillmentMessages));
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
                        }

                }


                // sending to individual socketId (private message)
                await io.to(`${socket.id}`).emit('chat', { response: botResponse });
            };

            return message();

        })

    });
};

module.exports = {
    createSocketConnection,
};
