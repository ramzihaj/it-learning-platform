const mongoose = require('mongoose');
const Progress = require('./models/Progress');
const Course = require('./models/Course');
const User = require('./models/User');
require('dotenv').config();

const seedProgress = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB pour seeding');

    // Clear existing progress
    await Progress.deleteMany({});
    console.log('Progrès existants supprimés');

    // Get a user and courses
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('Utilisateur test@example.com non trouvé. Veuillez créer un utilisateur.');
      mongoose.connection.close();
      return;
    }
    const courses = await Course.find({ branch: 'Web' }).limit(2); // e.g., HTML & CSS, JavaScript

    // Create progress entries
    const progressData = [
      {
        userId: user._id,
        courseId: courses[0]._id,
        completed: true,
        lastWatched: new Date(),
      },
      {
        userId: user._id,
        courseId: courses[1]._id,
        completed: false,
        lastWatched: new Date(),
      },
    ];

    await Progress.insertMany(progressData);
    console.log('Progrès seedés avec succès');

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    mongoose.connection.close();
  }
};

seedProgress();