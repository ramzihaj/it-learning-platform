const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour hash password

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedBranch: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Nouveau : rôle admin
}, { timestamps: true });

// Hash password avant save (si pas déjà)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);