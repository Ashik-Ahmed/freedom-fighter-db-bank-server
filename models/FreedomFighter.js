const mongoose = require('mongoose');
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;


const freedomFighterSchema = mongoose.Schema({
    memberType: {
        type: String,
        required: true
    },
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
    profilePhoto: {
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },

    country: {
        type: String,
        required: [true, "Country is required"]
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
            enum: ['General',
                'Lieutenant general',
                'Major general',
                'Brigadier general',
                'Colonel',
                'Lieutenant colonel',
                'Major',
                'Captain',
                'Lieutenant',
                'Second lieutenant',
                'Officer cadet',
                'Master warrant officer',
                'Senior warrant officer',
                'Warrant officer',
                'Regiment Sergeant Major',
                'Quarter Master Sergeant',
                'Sergeant Major',
                'Master Sergeant',
                'Sergeant',
                'Corporal',
                'Lance corporal',
                'Sainik',
                'Admiral',
                'Vice admiral',
                'Rear admiral',
                'Commodore',
                'Captain',
                'Commander',
                'Lieutenant commander',
                'Lieutenant',
                'Sub-lieutenant',
                'Acting sub-lieutenant',
                'Midshipman',
                'Officer cadet',
                'Master chief petty officer',
                'Senior chief petty officer',
                'Chief petty officer',
                'Leading seaman',
                'Able seaman',
                'Ordinary seaman',
                'Air Chief Marshal',
                'Air Marshal',
                'Air Vice-Marshal',
                'Air Commodore',
                'Group Captain',
                'Wing Commander',
                'Squadron Leader',
                'Flight Lieutenant',
                'Flight Sergeant',
                'Flying Officer',
                'Pilot Officer',
                'Officer cadet',
                'Master warrant officer',
                'Senior warrant officer',
                'Warrant officer',
                'Sergeant',
                'Corporal',
                'Leading aircraftman',
                'Aircraftman 1',
                'Aircraftman 2'
            ],
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