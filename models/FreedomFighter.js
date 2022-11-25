const mongoose = require('mongoose');
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;


const freedomFighterSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [3, 'Name must be at least 3 characters'],
        maxLength: [100, 'Name length  is too large'],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please provide a valid Email"]
    },
    mobile: {
        type: String,
        required: [true, "Contact number is required"],
        minLength: [6, "Mobile number must be 6 digits long"]
    },

    photo: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ["Alive", "Dead"]
    },

    force: {
        type: String,
        required: [true, "Force is required"],
        enum: ["Army", "Navy", "Air Force"]
    },

    officialRank: {
        rank: {
            type: String,
            required: [true, "Official Rank is required"],
            minLength: [3, "Designation must be at least 3 characters long"],
            enum: ["Lt. Colonel", "Brigadier General", "Major", "Colonel", "Major General"],
        },
        point: {
            type: Number,
            required: [true, "Official rank point is required"],
            min: [0, "Official Rank point cant be negative"]
        }
    },

    birthday: {
        type: Date,
    },

    freedomFighterRank: {
        rank: {
            type: String,
            required: [true, "Freedom Fighter rank is required"],
            minLength: [3, "Designation must be at least 3 characters long"],
            enum: ["Bir Shreshtho", "Bir Uttam", "Bir Bikrom", "Bir Muktijoddha"]
        },

        point: {
            type: Number,
            required: [true, "Freedom Fighter rank point is required"],

            min: [0, "Freedom Fighter Rank point cant be negative"]

        }

    },

    invited: {
        type: Array,
    },

    facilitiesAvailed: {
        type: String,
        minLength: [10, "facility details too short"]
    },

    complaints: {
        issue: {
            type: String,
            minLength: [10, "Issue details too short"]
        },
        status: {
            type: String,
            enum: ["New", "Pending", "Resolved"],
        },
        feedback: {
            type: String,
            minLength: [5, "Feedback too short"]
        }
    },

    successor: [{
        type: ObjectId,
        ref: 'Successor'
    }]

},

    {
        timestamps: true
    }

)


const FreedomFighter = mongoose.model('FreedomFighter', freedomFighterSchema);

module.exports = FreedomFighter;