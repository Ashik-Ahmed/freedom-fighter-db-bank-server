const mongoose = require('mongoose');
const validator = require("validator");
const { ObjectId } = mongoose.Schema.Types;


const successorSchema = mongoose.Schema(
    {

        freedomFighterId: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: [true, "Successor Name is required"],
            trim: true,
            minLength: [3, 'Name must be at least 3 characters'],
            maxLength: [60, 'Name length  is too large'],
        },

        email: {
            type: String,
            validate: [validator.isEmail, "Please provide a valid email"],
            trim: true,
            lowercase: true,
            unique: [true, 'Email already exists'],
            required: [true, 'Email address is required'],
        },

        mobile: {
            type: String,
            required: [true, "Contact number is required"],
            minLength: [6, "Mobile number must be 6 digits long"]
        },

        address: {
            type: String,
            required: true
        },

        photo: {
            type: String,
        },

        birthday: {
            type: Date,
            min: [0, "Age cannot be negative"]
        },

        occupation: {
            type: String
        },

        relation: {
            type: String,
            required: [true, "Relation is required"]
        },

    },

    {
        timestamps: true,
    }
);


const Successor = mongoose.model('Successor', successorSchema);
module.exports = Successor;