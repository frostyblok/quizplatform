const mongoose = require('mongoose');


const newsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const NewsItem = mongoose.model('NewsItem', newsSchema);

module.exports = NewsItem;
