let mongoose = require('mongoose');

let blogPostSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    photos: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
        required: true
    },
    tags: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', unique: true }],
        required: false
    }
});

let BlogPost = module.exports = mongoose.model('BlogPost', blogPostSchema);