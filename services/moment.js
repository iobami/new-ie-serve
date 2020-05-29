const moment = require('moment');

const formatISO = (data) => {
    const [ billDate, billTime] = data.split('T');
    const [formattedTime] = billTime.split('.');

    return {
        date: moment(`${billDate}`).format('LL'),
        time: moment(`${billDate} ${formattedTime}`).format('LTS')
    };
};

module.exports = {
    formatISO,
};
