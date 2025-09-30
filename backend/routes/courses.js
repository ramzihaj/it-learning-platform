const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get courses by branch
router.get('/:branch', async (req, res) => {
  try {
    const { branch } = req.params;
    const courses = await Course.find({ branch }).select('title youtubeUrl description _id');
    if (!courses.length) {
      return res.status(404).json({ error: 'Aucun cours trouvé pour cette branche' });
    }
    res.json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;