const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ajoutez à .env
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

// Créer session Stripe pour paiement
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { branch } = req.body;

    // Créer/mettre à jour subscription
    let subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      subscription = new Subscription({ userId, branch });
      await subscription.save();
    } else {
      subscription.branch = branch;
      await subscription.save();
    }

    // Créer session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Accès Premium - ${branch}` },
          unit_amount: 999, // 9.99€
        },
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/courses`,
      customer_email: req.user.email, // De User model
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe:', error);
    res.status(500).json({ error: 'Erreur paiement' });
  }
});

// Check quota vidéos
router.get('/quota/:branch', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { branch } = req.params;
    const subscription = await Subscription.findOne({ userId, branch });
    if (!subscription || subscription.status === 'canceled') {
      return res.json({ quota: 0, premium: false });
    }
    res.json({ quota: subscription.status === 'trial' ? 5 - subscription.videosWatched : Infinity, premium: subscription.status === 'active' });
  } catch (error) {
    console.error('Erreur quota:', error);
    res.status(500).json({ error: 'Erreur quota' });
  }
});

// Incrémenter vidéos vues
router.post('/watch-video', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { branch } = req.body;
    const subscription = await Subscription.findOne({ userId, branch });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription non trouvée' });
    }
    subscription.videosWatched += 1;
    await subscription.save();
    res.json({ videosWatched: subscription.videosWatched });
  } catch (error) {
    console.error('Erreur watch video:', error);
    res.status(500).json({ error: 'Erreur compteur' });
  }
});

module.exports = router;