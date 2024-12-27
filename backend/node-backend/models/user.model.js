const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },

    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
    },

    phone: {
        type: String,
        required: [true, "Please enter your phone number"],
        unique: true,
    },

    isFaceSetup: {
        type: Boolean,
        default: false, // Determines if the user has set up face verification
    },

    balance: {
        type: Number,
        default: 0, // Initial balance set to 0
    },

    accountNumber: {
        type: String,
        unique: true, // Generated account number for the user
        required: true,
    },

    profilePicture: {
        type: String,
        required: false, // This can be optional during signup
        default: null, // Default to null if no picture is provided
    },

    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction', // Reference to Transaction schema
    }],

}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
