const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const { jsPDF } = require('jspdf');
require('dotenv').config();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ Fix : Inclusion seulement (exclut password par défaut, inclut role)
    const user = await User.findById(userId).select('name email selectedBranch role');  // Pas de '-password' mixé
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
    // ✅ Même fix pour update
    const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true }).select('name email selectedBranch role');
    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    console.error('Erreur update profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Generate certificate - Design PRO inspiré exemple (badge, signature, logos)
router.post('/certificate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    // ✅ Fix : Inclusion seulement
    const user = await User.findById(userId).select('name selectedBranch');
    const progress = await Progress.find({ userId }).populate('courseId');
    const completedCount = progress.filter(p => p.completed).length;

    if (completedCount < 5) {
      return res.status(400).json({ error: 'Complétez au moins 5 cours pour un certificat' });
    }

    const doc = new jsPDF();

    // Header : Badge "INFORMATION TECHNOLOGY SPECIALIST" avec étoiles (exactement comme exemple)
    doc.setFillColor(0, 51, 102); // Bleu foncé
    doc.roundedRect(20, 10, 170, 30, 5, 5, 'F'); // Bordure arrondie
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255); // Blanc
    doc.text('INFORMATION TECHNOLOGY', 105, 22, { align: 'center' });
    doc.text('SPECIALIST', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(' * * * * * ', 105, 35, { align: 'center' }); // Étoiles comme exemple
    doc.setTextColor(0, 0, 0); // Noir

    // Titre certificat (comme exemple)
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Certification Requirements for', 105, 55, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${user.selectedBranch || 'HTML and CSS'}`, 105, 70, { align: 'center' });

    // Bordure sous titre
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    // Nom utilisateur centré (comme "Haj massoud Ramzi")
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${user.name}`, 105, 100, { align: 'center' });

    // Déclaration complétion (comme exemple)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the', 105, 120, { align: 'center' });
    doc.text('certification requirements for', 105, 130, { align: 'center' });

    // Bordure sous déclaration
    doc.line(40, 135, 160, 135);

    // Signature ligne (comme exemple)
    doc.line(40, 160, 160, 160);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Dr. Gary A. Gates', 50, 170);
    doc.text('Date Awarded', 105, 170, { align: 'center' });
    doc.text('vbKm-DwVk', 150, 170, { align: 'right' });

    // Date (comme "February 14, 2024")
    doc.setFont('helvetica', 'normal');
    doc.text('October 05, 2025', 105, 180, { align: 'center' });

    // Footer logos (comme exemple)
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('Certiport', 30, 280);
    doc.text('CertNexus', 80, 280);
    doc.text('Pearson', 130, 280);

    // Bordure footer
    doc.line(20, 282, 190, 282);

    // Sauvegarde et envoi
    const pdfBuffer = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificat-professionnel.pdf');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Erreur certificat:', error);
    res.status(500).json({ error: 'Erreur génération certificat' });
  }
});

module.exports = router;