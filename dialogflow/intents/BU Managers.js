const { texts } = require('../messageComponents');
// const { texts, quickReplies } = require('../dialogflow/messageComponents');


const buManagersIntent = (result, botResponse) => {
    const { businessUnits } = result.parameters.fields;
    const buArray = buManagersDetails();

    try {
        if ((businessUnits.stringValue !== '')) {
            let count = 1;
            for (count; count < buArray.length;  count += 1) {
                if (businessUnits.stringValue.toLowerCase() === buArray[count][1].toLowerCase()) {
                    const formattedText = [
                        `The BU manager for ${buArray[count][1]} is ${buArray[count][2]}, phone is: ${buArray[count][3]}
                 and email is: ${buArray[count][4]}.`,
                    ];
                    const text = texts({ text: formattedText });
                    botResponse.push(text);
                    return;
                }
            }
        } else {
            let count = 1;
            for (count; count < buArray.length;  count += 1) {
                const formattedText = [
                    `The BU manager for ${buArray[count][1]} is ${buArray[count][2]}, phone is: ${buArray[count][3]}
                 and email is: ${buArray[count][4]}.`,
                ];
                const text = texts({ text: formattedText });
                botResponse.push(text);
            }
        }
    } catch (e) {
        const formattedText = [
            e.message,
        ];
        const text = texts({ text: formattedText });
        botResponse.push(text);
    }
};

const buManagersDetails = () => {
    return [
        ['S/n', 'Business Unit', 'Name', 'Phone Number', 'Email Address'],
        ['1', 'Ikorodu', 'Olurotimi Famoroti', '08172177619', 'ofamoroti@ikejaelectric.com'],
        ['2', 'Ikeja', 'Enobong Ezekiel', '09087099472', 'eezekiel@ikejaelectric.com'],
        ['3', 'Akowonjo', 'Lawrence Okoye', '08172230137', 'Lokoye@ikejaelectric.com'],
        ['4', 'Abule Egba', 'Oloyede Henry Adelakun', '08172230128', 'oadelakun@ikejaelectric.com'],
        ['5', 'Oshodi', 'Taofik Basanya', '08090377760', 'tbasanya@ikejaelectric.com'],
        ['6', 'Shomolu', 'Olanrewaju Yusuf', '09087405456', 'oayusuf@ikejaelectric.com'],
    ];
};

module.exports = {
    buManagersIntent,
};
