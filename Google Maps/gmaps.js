const createClient = () => {
    console.log('creating maps client');
    const googleMapsClient = require('@google/maps').createClient({
        key: process.env.GOOGLE_MAPS_API_KEY
    });

    console.log(googleMapsClient.places());

    googleMapsClient.places({
    }, function(err, response) {
        console.log(err);
        if (!err) {
            console.log(response.json.results);
        }
    });
};

module.exports = {
    createClient
};
