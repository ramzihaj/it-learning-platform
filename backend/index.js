const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware pour parser JSON
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Serveur MERN fonctionne !' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});