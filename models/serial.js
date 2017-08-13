const mongoose = require('mongoose');

const Token = require('./token');

const serialSchema = mongoose.Schema({
  serial: {
    type: Number,
    index: true,
    token: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Token',
    }
  }
});

const Serial = mongoose.model('Serial', serialSchema);
module.exports = Serial;
