const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L’ID utilisateur est requis'],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'L’ID du cours est requis'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Progress', progressSchema);