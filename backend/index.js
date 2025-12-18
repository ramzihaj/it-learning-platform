const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Créez app EN PREMIER (fix l'erreur initialization)
const app = express();
const port = process.env.PORT || 5000;

// Middleware (après app)
app.use(cors());
app.use(express.json());

// Require routes APRÈS app (fix l'ordre)
const authRoutes = require('./routes/auth');
const branchRoutes = require('./routes/branches');
const courseRoutes = require('./routes/courses');
const progressRoutes = require('./routes/progress');
const summaryRoutes = require('./routes/summary');
const profileRoutes = require('./routes/profile'); // Ajouté ici
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact'); // Nouveau : route contact

// Après les autres app.use
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/profile', profileRoutes); // Ligne 11 maintenant OK
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes); // Nouveau : route contact
// MongoDB connection (sans options dépréciées)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});