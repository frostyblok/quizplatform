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
    score: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  scholarsCup: {
    score: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  scholarsBowl: {
    score: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  educationGrant: {
    score: {
      type: Number,
      default: 0
    },
    time: {
      type: Number,
      default: 0
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
});


userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.surName}`;
});


const User = mongoose.model('User', userSchema);
module.exports = User;
