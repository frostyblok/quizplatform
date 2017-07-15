const mongoose = require('mongoose');

const User = require('./user');

const institutionSchema =  mongoose.Schema ({
  institution: {
    type: String,
    required: true,
  },
});

institutionSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'Institution',
  justOne: false,
})

const Institution = mongoose.model('Institution', institutionSchema);
module.exports = Institution;
