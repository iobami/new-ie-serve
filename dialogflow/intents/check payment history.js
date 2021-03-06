const { getPaymentHistory } = require('../../services/index');
const { texts } = require('../messageComponents');

const checkPayment = async (accountNumber, billDate) => {
    const textArray = [];
    try {
        const { data }  = await getPaymentHistory(accountNumber);
        const naira = '\u{020A6}';

        if (data.error) {
            const formattedText = [
                data.message,
            ];

            const text = texts({
                text: formattedText,
            });
            textArray.push(text);
            return textArray;
        }

        if (billDate === 'current') {
            const count = 6;
            let amount = `amount${count}`;
            let month = `month${count}`;

            const formattedText = [
                `You paid ${naira} ${data.data[amount]} on  ${data.data[month]}`,
            ];

            const text = texts({
                text: formattedText,
            });

            textArray.push(text);
            return textArray;
        }

        let count = 1;
        for (count; count < 7;  count += 1) {
            let amount = `amount${count}`;
            let month = `month${count}`;

            const formattedText = [
                `You paid ${naira} ${data.data[amount]} on  ${data.data[month]}`,
            ];

            const text = texts({
                text: formattedText,
            });

            textArray.push(text);
        }

        return textArray;
    } catch (e) {
        console.log(e.message);
        const formattedText = [
            'Error occurred, please try again.',
        ];
        const text = texts({ text: formattedText });
        textArray.push(text);

        return textArray;
    }
};

module.exports = {
    checkPayment,
};
