const { getExistingServiceRequest } = require('../../services/index');
const { createServiceRequest } = require('../../services/index');
const { texts } = require('../messageComponents');

const checkExistingSR = async (ticketNumber) => {
    const { data } = await getExistingServiceRequest(ticketNumber);
    const textArray = [];

    if (data.error) {
        const text = texts({ text: data.message });
        textArray.push(text);
        return textArray;
    }

    const { status, case_no } = data.data[0];
    const formattedText = [
        `Your request with ${case_no} is ${status}.`,
    ];
    const text = texts({ text: formattedText });
    textArray.push(text);

    return textArray;
};

const  createNewSR = async (srDetails) => {
    const textArray = [];

    const complaints = {
        name: srDetails.subject,
        created_by: process.env.APP_CRM_USER,
        created_by_name: 'customer_portal',
        description: `A customer Account Number: ${srDetails.account_no}`
            + `raised a case concerning the below issue from the chat app : \n\n${srDetails.description}. \n\n`
            + `The Customer may be contacted via the following medium \nEmail : ,`
            + `Phone No. : , Contact Address: null.`,
        status: 'Open',
        priority: 'P1',
        account_name: srDetails.account_no,
        state: 'Open',
        category: 'REQUEST/ENQUIRY',
        sub_category: 'enquiry_about_ie',
        channel_source: 'Live Chat Web',
        case_no: '',
        id: '',
        assigned_user_id: process.env.APP_CRM_USER,
    };

    try {
        const { data } = await createServiceRequest(complaints);
        console.log(JSON.stringify(data));
    } catch (e) {
        console.log(e);
        const formattedText = [
            'Error occurred, please try again.',
        ];
        const text = texts({ text: formattedText });
        textArray.push(text);

        return textArray;
    }
};

module.exports = {
    checkExistingSR, createNewSR,
};
