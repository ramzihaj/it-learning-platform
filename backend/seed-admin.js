const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');  // Assure-toi que User model a 'role'
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connecté à MongoDB pour seed admin');

    // Créer ou updater admin
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.findOneAndUpdate(
      { email: adminEmail },
      { name: 'Admin Test', email: adminEmail, password: hashedPassword, role: 'admin' },
      { upsert: true, new: true }
    );

    console.log(`Admin créé/mis à jour : ${adminEmail} / ${adminPassword}`);
    mongoose.connection.close();
  })
  .catch(err => console.error('Erreur seed admin:', err));