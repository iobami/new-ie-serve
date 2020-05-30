const cards = (data) => {

    const buttons = [];
    data.buttons.forEach((buttonObject) => {
        buttons.push({
            action: buttonObject.postback, text: buttonObject.text,
        });
    });

    return {
        text: data.title,
        subtitle: data.subtitle,
        group: {
            title: '',
            options: buttons,
        },
        options: null,
    };
};

const texts = (data) => {
    return {
        text: data.text[0],
        group: null,
        options: null,
    };
};

const links = (data) => {
    return {
        text: null,
        link: data.text[0],
        group: null,
        options: null,
    };
};

const quickReplies = (data) => {

    const optionsArray = [];
    data.quickReplies.forEach((quickReply) => {
        optionsArray.push({
            text: quickReply,
        });
    });

    return {
        text: null,
        group: null,
        options: optionsArray,
    };
};

module.exports = {
    cards, texts, quickReplies, links,
};
