let mongoose = require('mongoose');

let photoSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  }
});

let Photo = module.exports = mongoose.model('Photo', photoSchema);