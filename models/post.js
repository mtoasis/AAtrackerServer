const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  updated: { type: Date, default: Date.now },
  userID: { type: String, required: true },
  name: {type: String, required: true},
  schedule: { type: Array, required: true },
  surveyQA:{type:Object, required: true}
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
