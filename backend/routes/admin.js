const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const adminMiddleware = require('../middleware/admin'); // Nouveau middleware

// GET : Liste tous les users (pour admin)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }); // Sans password
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Erreur liste users:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE : Supprimer un user (par ID)
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User non trouvé' });
    }
    res.json({ message: 'User supprimé', userId: req.params.id });
  } catch (error) {
    console.error('Erreur delete user:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE : Supprimer TOUS les users (dangereux !)
router.delete('/users/all', adminMiddleware, async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: 'Tous les users supprimés', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Erreur delete all users:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET : Liste tous les cours (pour admin)
router.get('/courses', adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find().populate('branch', 'name'); // Si branch devient ref plus tard
    res.json({ courses, count: courses.length });
  } catch (error) {
    console.error('Erreur liste courses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST : Ajouter un nouveau cours (avec vidéo YouTube)
router.post('/courses', adminMiddleware, async (req, res) => {
  try {
    const { title, branch, youtubeUrl, description } = req.body;
    if (!title || !branch || !youtubeUrl) {
      return res.status(400).json({ error: 'Titre, branche et URL vidéo requis' });
    }

    const newCourse = new Course({ title, branch, youtubeUrl, description });
    await newCourse.save();
    res.status(201).json({ message: 'Cours ajouté', course: newCourse });
  } catch (error) {
    console.error('Erreur add course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE : Supprimer un cours (et sa vidéo)
router.delete('/courses/:id', adminMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    res.json({ message: 'Cours supprimé', courseId: req.params.id });
  } catch (error) {
    console.error('Erreur delete course:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE : Supprimer TOUS les cours (dangereux !)
router.delete('/courses/all', adminMiddleware, async (req, res) => {
  try {
    const result = await Course.deleteMany({});
    res.json({ message: 'Tous les cours supprimés', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Erreur delete all courses:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;