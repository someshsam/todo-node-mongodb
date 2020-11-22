const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostsSchema = new Schema({
  userId: { type: String, required: true },
  posts: [{
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model('Posts', PostsSchema);
