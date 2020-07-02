const dialogflow = require('dialogflow');
// const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */


function runSample(projectId) {
}

runSample(process.env.PROJECT_ID);

const getDialogFlowResponse = async (projectId, userMessage, socketId) => {
    // A unique identifier for the given session
    // const sessionId = uuid.v4();
    const  sessionId = socketId;

    const client_email = process.env.CLIENT_EMAIL;
    const private_key = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({
        projectId,
        credentials: {
            client_email,
            private_key
        }
    });
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                // text: 'hello, I speak French',
                text: userMessage,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
//   console.log('Detected intent');
    return responses[0].queryResult;
};

module.exports = {
    getDialogFlowResponse,
};
