const auth = require('./auth'); // Ton middleware auth existant
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  await auth(req, res, async () => { // Chain avec auth
    if (req.user.role !== 'admin') { // Vérifie rôle après décodage JWT
      return res.status(403).json({ error: 'Accès admin requis' });
    }
    next();
  });
};

module.exports = adminMiddleware;