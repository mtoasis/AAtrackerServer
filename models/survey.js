const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema({
  updated: { type: Date, default: Date.now },
  q1: {type: Object, required: true},
  q2: { type: Object, required: true },
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
