const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({
    firstname: { 
        type: String, 
        required: true, 
        trim: true },
    lastname: { 
        type: String, 
        required: true, 
        trim: true },
    email: { 
        type: String, 
        required: true, 
        validate: [isEmail], 
        unique: true, 
        trim: true },
    password: { 
        type: String, 
        required: true, 
        trim: true },
    userPicture: { 
        type: String, 
        required: false }, 
    isAdmin: {
        type: Boolean
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);