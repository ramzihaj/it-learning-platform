const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const auth = require('../middleware/auth');

// Mark course as completed
router.post('/', auth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Check if progress exists
    let progress = await Progress.findOne({ userId, courseId });
    if (progress) {
      progress.completed = true;
      progress.lastWatched = Date.now();
      await progress.save();
      return res.json({ message: 'Cours marqué comme complété', progress });
    }

    // Create new progress entry
    progress = new Progress({
      userId,
      courseId,
      completed: true,
    });
    await progress.save();
    res.status(201).json({ message: 'Cours marqué comme complété', progress });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du progrès:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get user progress
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    const progress = await Progress.find({ userId })
      .populate('courseId', 'title branch description youtubeUrl')
      .select('courseId completed lastWatched');
    res.json(progress);
  } catch (error) {
    console.error('Erreur lors de la récupération du progrès:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;