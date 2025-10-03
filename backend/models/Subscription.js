const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stripeCustomerId: { type: String },
  subscriptionId: { type: String },
  status: { type: String, enum: ['active', 'canceled', 'trial'], default: 'trial' }, // Trial pour 5 vidéos gratuites
  videosWatched: { type: Number, default: 0 }, // Compteur vidéos vues
  branch: { type: String }, // Branche actuelle pour quota
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);