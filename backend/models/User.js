//userSchema for permanent

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        default: null,
        required: true, 
    },
    email: {
        type: String,
        default: null,
        required: true,
        unique: true,
    },
    verified : {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    solvedProblems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        default: []
    }],
    Admin:{
        type:Boolean,
        default:false,
    }
}, {timestamps : true});

module.exports = mongoose.model('User', userSchema);
