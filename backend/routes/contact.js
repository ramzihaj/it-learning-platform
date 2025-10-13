const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

// Validation rules pour le formulaire de contact
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le sujet doit contenir entre 5 et 200 caractères'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Le message doit contenir entre 10 et 1000 caractères')
];

// Fonction pour sauvegarder le message dans un fichier
const saveContactMessage = async (contactData) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      ...contactData,
      ip: contactData.ip || 'unknown'
    };
    
    const logPath = path.join(__dirname, '../logs/contact-messages.json');
    
    // Créer le dossier logs s'il n'existe pas
    const logsDir = path.dirname(logPath);
    await fs.mkdir(logsDir, { recursive: true });
    
    // Lire les messages existants
    let messages = [];
    try {
      const existingData = await fs.readFile(logPath, 'utf8');
      messages = JSON.parse(existingData);
    } catch (error) {
      // Fichier n'existe pas encore, commencer avec un tableau vide
    }
    
    // Ajouter le nouveau message
    messages.push(logEntry);
    
    // Sauvegarder
    await fs.writeFile(logPath, JSON.stringify(messages, null, 2));
    
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde message contact:', error);
    return false;
  }
};

// Route POST /api/contact
router.post('/', contactValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

    // Données du message
    const contactData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      ip: clientIP
    };

    // Sauvegarder le message
    const saved = await saveContactMessage(contactData);
    
    if (!saved) {
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde du message'
      });
    }

    // Log dans la console pour le développement
    console.log('📧 Nouveau message de contact reçu:');
    console.log(`👤 Nom: ${contactData.name}`);
    console.log(`📧 Email: ${contactData.email}`);
    console.log(`📝 Sujet: ${contactData.subject}`);
    console.log(`💬 Message: ${contactData.message}`);
    console.log(`🌐 IP: ${contactData.ip}`);
    console.log(`⏰ Timestamp: ${contactData.timestamp}`);
    console.log('---');

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
      data: {
        id: Date.now(), // ID simple pour le frontend
        timestamp: contactData.timestamp
      }
    });

  } catch (error) {
    console.error('Erreur route contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi du message'
    });
  }
});

// Route GET /api/contact/messages (pour admin - optionnel)
router.get('/messages', async (req, res) => {
  try {
    // Vérifier si c'est un admin (optionnel)
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // if (!token) {
    //   return res.status(401).json({ message: 'Token requis' });
    // }

    const logPath = path.join(__dirname, '../logs/contact-messages.json');
    
    try {
      const data = await fs.readFile(logPath, 'utf8');
      const messages = JSON.parse(data);
      
      res.json({
        success: true,
        count: messages.length,
        messages: messages.reverse() // Plus récents en premier
      });
    } catch (error) {
      res.json({
        success: true,
        count: 0,
        messages: []
      });
    }
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
});

// Route GET /api/contact/stats (statistiques - optionnel)
router.get('/stats', async (req, res) => {
  try {
    const logPath = path.join(__dirname, '../logs/contact-messages.json');
    
    try {
      const data = await fs.readFile(logPath, 'utf8');
      const messages = JSON.parse(data);
      
      // Statistiques simples
      const stats = {
        total: messages.length,
        today: messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          const today = new Date();
          return msgDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return msgDate >= weekAgo;
        }).length,
        thisMonth: messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return msgDate >= monthAgo;
        }).length
      };
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      res.json({
        success: true,
        stats: {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0
        }
      });
    }
  } catch (error) {
    console.error('Erreur stats contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques'
    });
  }
});

module.exports = router;
