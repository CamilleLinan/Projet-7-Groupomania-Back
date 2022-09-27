const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    posterId: { type: String, required: true },
    message: { type: String, required: true, maxlength: 500 },
    postPicture: { type: String, required: false },
    likes: { type: Number, required: false, default: 0 },
    usersLiked: { type: [String], required: false },
    comments: { 
        type: [{
            commenterId: String,
            text: String,
            timestamps: Number,
        }], require: false },
}, {timestamps: true});

module.exports = mongoose.model('Post', postSchema);