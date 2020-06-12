const mongoose = require("mongoose");


const TravelSchema = new mongoose.Schema ({
    location: {
        type: String,
        required: true
    },
    itinerary: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        tag: {
            type: String,
            required: true
        },
        coords: {
            lat: {
                type: Number
            },
            lng: {
                type: Number
            }
        }
    }]
});


module.exports = TravelSchema;
