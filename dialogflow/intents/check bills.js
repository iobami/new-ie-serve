const { getBillHistory } = require('../../services/index');
const { formatISO } = require('../../services/moment');
const { texts } = require('../messageComponents');

const checkBills = async (accountNumber, billDate) => {
    const { data }  = await getBillHistory(accountNumber);
    const textArray = [];
    let billHistory = [];

    if (data.data.length) {
        const naira = '\u{020A6}';

        // check if user wants the current bill then return latest bill
        if (billDate === 'current') {
            billHistory.push(data.data[0]);
        } else {
            billHistory = data.data.reverse();
        }

        await billHistory.forEach((billObject) => {
            const { DATE_RECEIVED, AMOUNT } = billObject;

            const date_and_time = formatISO(DATE_RECEIVED);

            const formattedText = [
                `Your bill for ${date_and_time.date} is ${naira} ${AMOUNT}`,
            ];
            const text = texts({ text: formattedText });
            textArray.push(text);
        });
        return textArray;
    } else {
        const formattedText = [
            `Bill history for ${accountNumber} is not available`,
        ];
        const text = texts({ text: formattedText });
        textArray.push(text);
        return textArray;
    }
};

module.exports = {
    checkBills,
};
