const mongoose = require('mongoose');

const Institution = require('./institution');
const Token = require('./token');

const userSchema =  mongoose.Schema ({
  email: {
    type: String,
    required: true,
    max: 100,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    min: 8,
    max: 60,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 60,
  },
  surName: {
    type: String,
    max: 100,
  },
  firstName: {
    type: String,
    max: 100,
  },
  sex: {
    type: String,
    max: 6,
  },
  phoneNumber: Number,
  matriculationNumber: String,
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    required: true,
  },
  isRegistered: {
    type: Boolean,
    default: false,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
  },
  dateJoined: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isSuperUser: {
    type: Boolean,
    required: true,
    default: false,
  },
  isStaff: {
    type: Boolean,
    required: true,
    default: false,
  },
  virtualQuiz: {
    score: Number,
    time: Number,
  },
  scholarsCup: {
    score: Number,
    time: Number,
  },
  scholarsBowl: {
    score: Number,
    time: Number,
  },
  educationGrant: {
    score: Number,
    time: Number,
  },
});


userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.surName}`;
});


const User = mongoose.model('User', userSchema);
module.exports = User;
