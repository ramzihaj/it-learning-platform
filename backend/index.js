const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(express.json());
app.use('/api/auth', authRoutes); // Mount auth routes

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur MERN fonctionne !' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});