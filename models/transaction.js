const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  timeStarted: {
    type: Date,
    default: Date.now(),
  },
  timeEnded: {
    type: Date,
  },
  paystackId: {
    type: String,
  },
  status: {
    type: String,
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports= Transaction;
