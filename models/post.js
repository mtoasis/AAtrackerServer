const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  userID: { type: String, required: true },
  schedule: { type: Object, required: true },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
