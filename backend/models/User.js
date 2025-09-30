const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  selectedBranch: { type: String, default: null }, // For Web, IA, DevOps, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);