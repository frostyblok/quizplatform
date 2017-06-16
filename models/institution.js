const mongoose = require('mongoose');

const User = require('./user');

const institutionSchema =  mongoose.Schema ({
  institution: {
    type: String,
    required: true,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
});


const Institution = mongoose.model('Institution', institutionSchema);
module.exports = Institution;
