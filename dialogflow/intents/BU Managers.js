const { texts } = require('../messageComponents');
// const { texts, quickReplies } = require('../dialogflow/messageComponents');


const buManagersIntent = (result, botResponse) => {
    if ((result.parameters.fields.businessUnits.stringValue !== '')) {
        const formattedText = [
            `Kindly hold on while I get info on ${result.parameters.fields.businessUnits.stringValue}`,
        ];
        const text = texts({ text: formattedText });
        botResponse.push(text);
    } else {
        const formattedText = [
            'Kindly hold on while I get list of BU Mgs',
        ];
        const text = texts({ text: formattedText });
        botResponse.push(text);
    }
};

module.exports = {
    buManagersIntent,
};
