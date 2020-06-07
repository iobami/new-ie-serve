const { texts, quickReplies } = require('../messageComponents');
const { touchPoints } = require('../../touchpoints/touchpoints');
const UTs = require('../../touchpoints/UTs');

// const BUs = [
//     "Abule Egba",
//     "Akowonjo",
//     "Ikeja",
//     "Ikorodu",
//     "Oshodi",
//     "Shomolu",
//     ];

const getManagersInUT = (ut, botResponse) => {

    try {
        const touchPoint = touchPoints();
        const managers = [];

        for (const touchPointObject of touchPoint) {
            if ((touchPointObject.Station) && (touchPointObject.Station.toLowerCase() === ut.toLowerCase())) {
                managers.push(touchPointObject);
            }
        }

        if (managers.length) {
            for (const managerDetails of managers) {
                const formattedText = [
                    `The ${managerDetails.Role} of ${managerDetails.Station} is ` +
                    `${managerDetails['Employee Name']}. Contact at ${managerDetails['CUG Telephone Number']} ` +
                    `or ${managerDetails['IE Email Address']}`,
                ];
                const text = texts({ text: formattedText });
                botResponse.push(text);
            }
        } else {
            notAvailable(ut, botResponse);
        }


    } catch (e) {
        notAvailable(ut, botResponse);
    }

};

const notAvailable = (ut, botResponse) => {
    const formattedText = [
        `Sorry, contact details to ${ut} not available at the moment`,
    ];
    const text = texts({ text: formattedText });
    botResponse.push(text);
};

const getTouchPointsUTs = async (bu) => {
    let ut = [];

    for (const UT of UTs) {
        if ((UT.bu.toLowerCase() === bu.toLowerCase())) {
            ut = UT.ut;
        }
    }

    return await quickReplies({ quickReplies: ut });
};

module.exports = {
    getManagersInUT, getTouchPointsUTs,
};
