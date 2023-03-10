const { default: mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    photo: {
        type: String,
    },
    email: {
        type: String,
    }
},
    {
        timestamps: true
    }
)


const Event = mongoose.model('Event', eventSchema)
module.exports = Event;