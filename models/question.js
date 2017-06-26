const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: String,
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  correctAnswer: String,
  pack: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
