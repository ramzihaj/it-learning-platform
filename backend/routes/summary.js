const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Générer résumé d'un cours
router.post('/generate/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    const prompt = `Résume ce cours en 300 mots maximum en français. Cours : ${course.title}. Description : ${course.description}. Rends-le clair et structuré pour un étudiant débutant en IT.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      max_tokens: 500,
    });

    const summary = completion.choices[0].message.content.trim();

    res.json({ summary, courseTitle: course.title });
  } catch (error) {
    console.error('Erreur OpenAI summary:', error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du résumé' });
  }
});

// Générer quiz pour un cours
router.post('/quiz/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }

    const prompt = `Génère un quiz de 5 questions à choix multiple (MCQ) en français sur ce cours. Chaque question doit avoir 4 options (A, B, C, D) et une réponse correcte. Format JSON : { "questions": [{ "question": "...", "options": ["A: ...", "B: ...", "C: ...", "D: ..."], "correctAnswer": "A" }] }. Cours : ${course.title}. Description : ${course.description}. Questions adaptées à un débutant.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
      max_tokens: 800,
    });

    let quiz = JSON.parse(completion.choices[0].message.content.trim());
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      return res.status(500).json({ error: 'Format de quiz invalide' });
    }

    res.json({ quiz, courseTitle: course.title });
  } catch (error) {
    console.error('Erreur OpenAI quiz:', error.message);
    res.status(500).json({ error: 'Erreur lors de la génération du quiz' });
  }
});

module.exports = router;