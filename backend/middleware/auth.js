const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Accès refusé, token manquant' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id: user._id }
    next();
    
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;