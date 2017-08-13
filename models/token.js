const mongoose = require('mongoose');

const Serial = require('./serial');
const User = require('./user');

const tokenSchema = mongoose.Schema({
  token: {
    type: Number,
    index: true,
  },
  maxUse: Number,
  currentUse: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  serial: {
    type: Number,
    index: true,
  },
  spent: {
    type: Boolean,
    required: true,
    default: false,
  },
});


const Token = mongoose.model('Token', tokenSchema);


module.exports = Token;
