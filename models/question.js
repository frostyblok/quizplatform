const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  optionA: {
    type: String,
    required: true,
  },
  optionB: {
    type: String,
    required: true,
  },
  optionC: {
    type: String,
    required: true,
  },
  optionD: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  pack: {
    type: String,
    ref: 'Pack',
  },
});


const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
