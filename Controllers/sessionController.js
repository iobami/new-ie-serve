const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const service = new AssistantV2({
    version: process.env.WATSON_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.WASTON_APIKEY,
    }),
    url: process.env.WATSON_URL,
});

let sessionIdArray = [];

const startSession = async () => {

    sessionIdArray = [];

    return await service.createSession({
        assistantId: process.env.WATSON_ASSISTANT_ID
    }).then(res => {
        // console.log(JSON.stringify(res, null, 2));
        sessionIdArray.push(res.result.session_id);
        return res.result.session_id;
    })
        .catch(err => {
            console.log(err);
        });

};

const getServiceMessage = async (message) => {
    const serviceMessage = [];

    // let session_id = await startSession();
    console.log(sessionIdArray);

    await service.message({
        assistantId: process.env.WATSON_ASSISTANT_ID,
        sessionId: sessionIdArray[0],
        context: {
            'global': {
                'system': {
                    'user_id': 'my_user_id'
                }
            },
            'skills': {
                'main skill': {
                    'user_defined': {
                        'deptCutOff': 'dont know',
                    }
                }
            }
        },
        input: {
            'message_type': 'text',
            'text': message,
            'options': {
                'return_context': true,
            },
        },
    }).then(res => {
        // console.log(JSON.stringify(res, null, 2));
        // console.log(res.result.output.generic);
        serviceMessage.push(JSON.stringify(res.result));
        // serviceMessage.push(res.result.output.generic);
    })
        .catch(async err => {
            console.log(err);
            if (JSON.parse(err.body).code === 404) {
                let session_id = await startSession();
                sessionIdArray = [];
                sessionIdArray.push(session_id);
                await service.message({
                    assistantId: process.env.WATSON_ASSISTANT_ID,
                    sessionId: session_id,
                    input: {
                        'message_type': 'text',
                        'text': message,
                        'options': {
                            'return_context': true,
                        },
                    },
                }).then(res => {
                    // console.log(JSON.stringify(res, null, 2));
                    // console.log(res.result.output.generic);
                    serviceMessage.push(JSON.stringify(res.result));
                    // serviceMessage.push(res.result.output.generic);
                });
            }
        });

    return await serviceMessage;
};

module.exports = {
    startSession, getServiceMessage
};
