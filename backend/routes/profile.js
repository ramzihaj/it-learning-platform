const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const jsPDF = require('jspdf'); // Assurez-vous npm install jspdf@^2.5.1
require('dotenv').config();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    const progress = await Progress.find({ userId }).populate('courseId', 'title branch');
    const completedBranches = [...new Set(progress.filter(p => p.completed && p.courseId?.branch).map(p => p.courseId.branch))].length;
    res.json({ user, progress, stats: { completedBranches, totalCourses: progress.length } });
  } catch (error) {
    console.error('Erreur profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('-password');
    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur update profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Generate certificate - Corrigé pour jsPDF v2+
router.post('/certificate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('name selectedBranch');
    const progress = await Progress.find({ userId }).populate('courseId');
    const completedCount = progress.filter(p => p.completed).length;

    if (completedCount < 5) {
      return res.status(400).json({ error: 'Complétez au moins 5 cours pour un certificat' });
    }

    // Corrigé : Instanciation standard jsPDF (default export)
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Certificat de Complétion', 105, 30, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`Félicitations, ${user.name} !`, 105, 50, { align: 'center' });
    doc.text(`Vous avez complété ${completedCount} cours en ${user.selectedBranch || 'diverses branches'}.`, 105, 70, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Délivré par IT Learn Pro - Octobre 2025', 105, 100, { align: 'center' });

    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificat.pdf');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Erreur certificat:', error);
    res.status(500).json({ error: 'Erreur génération certificat' });
  }
});

module.exports = router;