const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const branchRoutes = require('./routes/branches');
const courseRoutes = require('./routes/courses'); // Ajouté la déclaration
const progressRoutes = require('./routes/progress');
const summaryRoutes = require('./routes/summary');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/summary', summaryRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur MERN fonctionne !' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});