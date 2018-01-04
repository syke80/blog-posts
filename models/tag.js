let mongoose = require('mongoose');

let tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

let Tag = module.exports = mongoose.model('Tag', tagSchema);