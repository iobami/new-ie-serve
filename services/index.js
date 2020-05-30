const axios = require('axios').default;

axios.defaults.headers.common['x-ibm-client-id'] = process.env.APP_CLIENT_ID;

const getBillHistory = (accountNumber) => {
    // return axios.get(`${process.env.APP_API_URL}/cispayments/${accountNumber}`);
    return axios({
        method: 'GET',
        // url: `${process.env.APP_API_TEST}/cispayments/${accountNumber}`,
        url: `${process.env.APP_API_URL}/cispayments/${accountNumber}`,
    });
};

const getPaymentHistory = (accountNumber) => {
    return axios({
        method: 'GET',
        url: `${process.env.APP_API_TEST}/digibill/premium/${accountNumber}`,
    });
};

const getExistingServiceRequest = (ticketNumber) => {
    return axios({
        method: 'GET',
        url: `${process.env.APP_API_URL}/cases/${ticketNumber}`,
    });
};

const createServiceRequest = (data) => {
    return axios({
        method: 'POST',
        url: `${process.env.APP_API_URL}/cases`,
        data: data,
    });
};

module.exports = {
    getBillHistory, getPaymentHistory, getExistingServiceRequest, createServiceRequest,
};
