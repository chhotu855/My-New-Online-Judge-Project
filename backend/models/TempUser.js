// for the user  which is sigining but not filling the otp

const mongoose = require('mongoose');

const TempUserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h' 
    }
}, { timestamps: true });

module.exports = mongoose.model("TempUser", TempUserSchema);
