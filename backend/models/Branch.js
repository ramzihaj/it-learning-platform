const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Web", "IA", "DevOps"
  description: { type: String, default: '' }, // Optional description
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Branch', branchSchema);