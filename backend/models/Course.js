const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
  },
  branch: {
    type: String,
    required: [true, 'La branche est requise'],
  },
  youtubeUrl: {
    type: String,
    required: [true, 'L’URL YouTube est requise'],
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Course', courseSchema);