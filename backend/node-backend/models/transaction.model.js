const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, "Sender is required"],
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: [true, "Receiver is required"],
    },

    amount: {
        type: Number,
        required: [true, "Please enter the transaction amount"],
        min: [0, "Transaction amount must be greater than or equal to 0"],
    },

    transactionType: {
        type: String,
        enum: ['transfer', 'deposit', 'withdrawal'],
        required: true,
        default: 'transfer',
    },

    status: {
        type: String,
        enum: ['success', 'pending', 'failed'],
        required: true,
        default: 'pending',
    },

    referenceNumber: {
        type: String,
        required: [true, "Transaction reference number is required"],
        unique: true,
    },

    description: {
        type: String,
        required: false,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },

    otpUsed: {
        type: Boolean,
        default: false,
    },

    faceVerified: {
        type: Boolean,
        default: false,
    },

    failureReason: {
        type: String,
        required: false,
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
