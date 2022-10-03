const User = require('../models/User.model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    posterId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    message: { type: String, required: true, maxlength: 500 },
    postPicture: { type: String, required: false },
    likes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false },
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema);