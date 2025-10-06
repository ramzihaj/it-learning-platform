const mongoose = require('mongoose');
const Branch = require('./models/Branch');
require('dotenv').config();

const branches = [
  { name: 'Web', description: 'Développement web (HTML, CSS, JS, React)' },
  { name: 'IA', description: 'Intelligence artificielle et machine learning' },
  { name: 'DevOps', description: 'Automatisation et gestion d’infrastructures' },
  { name: 'Cybersecurity', description: 'Sécurité informatique et protection des données' }, // Nouvelle
  { name: 'Data Science', description: 'Analyse de données et visualisation' }, // Nouvelle
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connecté à MongoDB');
    await Branch.deleteMany(); // Clear existing branches
    await Branch.insertMany(branches);
    console.log('Branches insérées avec succès');
    mongoose.connection.close();
  })
  .catch(err => console.error('Erreur:', err));
  const adminUser = new User({
  name: 'Admin Test',
  email: 'admin@example.com',
  password: 'admin123', // Sera hashé
  role: 'admin'
});
await adminUser.save();
console.log('Admin créé');