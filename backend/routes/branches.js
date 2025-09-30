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
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Select a branch (protected route)
router.post('/select', authMiddleware, async (req, res) => {
  try {
    const { branchId } = req.body;
    const userId = req.user.userId; // From JWT

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ error: 'Branche non trouvée' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { selectedBranch: branch.name },
      { new: true }
    );
    res.json({ message: 'Branche sélectionnée', user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;