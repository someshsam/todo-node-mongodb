const mongoose = require('mongoose');

const Schema = mongoose.Schema

const PostsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Posts', PostsSchema);