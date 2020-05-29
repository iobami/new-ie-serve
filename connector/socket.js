const { getDialogFlowResponse } = require('../dialogflow/getBotResponse');
const { getFormattedBotResponse } = require('../dialogflow/formatBotResponse');
const { texts } = require('../dialogflow/messageComponents');
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
                let result = await getDialogFlowResponse(process.env.PROJECT_ID, msg, socket.id);

                if (result.intent) {
                    console.log(`  Intent: ${result.intent.displayName}`);
                } else {
                    console.log(`  No intent matched.`);
                }

                console.log('--------------hello-----------+++++++++++++++++++++');

                let botResponse = [];

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

                            getFormattedBotResponse(result, botResponse);

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

                            let { displayName } = result.intent;
                            displayName = displayName.split('-');

                            function checkCard(data) {
                                return !data.card;
                            }

                            if ((displayName.length > 1) && (displayName[0].toLowerCase() === 'payment.centers')) {

                                result = {
                                    fulfillmentMessages: result.fulfillmentMessages.filter(checkCard),
                                };

                            }

                            if ((displayName.length > 1) && (displayName[0].toLowerCase() === 'touchpoints ')) {

                                result = {
                                    fulfillmentMessages: result.fulfillmentMessages.filter(checkCard),
                                };

                            }

                            if ((displayName[0] === 'ContactUs')) {

                                result = {
                                    fulfillmentMessages: result.fulfillmentMessages.filter(checkCard),
                                };

                            }

                            botResponse = await getFormattedBotResponse(result, botResponse);

                        }

                }


                // sending to individual socketId (private message)
                // console.log(botResponse);
                await io.to(`${socket.id}`).emit('chat', { response: botResponse });
            };

            return message();

        })

    });
};

module.exports = {
    createSocketConnection,
};
