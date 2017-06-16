const mongoose = require('mongoose');

profileSchema = {
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
}

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
