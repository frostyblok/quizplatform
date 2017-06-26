const mongoose = require('mongoose');

const Question = require('./question');

const packSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }]
});

const Pack = mongoose.model('Pack', packSchema);

module.exports= Pack;
