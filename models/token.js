const mongoose = require('mongoose');

const Serial = require('./serial');

const tokenSchema = mongoose.Schema({
  token: {
    type: Number,
    index: true,
    serial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Serial',
    }
  }
});


const Token = mongoose.model('Token', tokenSchema);


module.exports = Token;
