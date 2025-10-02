const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get all branches
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (error) {
    console.error('Erreur get branches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Select a branch (protected route)
router.post('/select', authMiddleware, async (req, res) => {
  try {
    const { branchId } = req.body;
    const userId = req.user.id; // Corrigé : req.user.id (du JWT { id: ... })

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Branche non trouvée' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { selectedBranch: branch.name },
      { new: true }
    );
    if (!user) { // Ajouté pour sécurité
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Branche sélectionnée', user });
  } catch (error) {
    console.error('Erreur select branch:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;