const getDeptCutOffResponse = (newReplyArray) => {
    const newReply = {
        "output": {
            "generic": newReplyArray,
            "intents": [],
            "entities": [
                {
                    "entity": "departments",
                    "location": [
                        0,
                        3
                    ],
                    "value": "Law",
                    "confidence": 1
                }
            ]
        },
    };
    return JSON.stringify(newReply);
};

module.exports = {
    getDeptCutOffResponse
};
