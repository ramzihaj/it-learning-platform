const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const courses = [
  {
    title: 'HTML & CSS Crash Course',
    branch: 'Web',
    youtubeUrl: 'https://www.youtube.com/watch?v=hu-q2z7e4pk',
    description: 'Apprenez les bases du développement web avec HTML et CSS.',
  },
  {
    title: 'JavaScript pour débutants',
    branch: 'Web',
    youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    description: 'Introduction à JavaScript pour le développement web.',
  },
  {
    title: 'Introduction à l’IA avec Python',
    branch: 'IA',
    youtubeUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg',
    description: 'Découvrez les concepts de base de l’intelligence artificielle.',
  },
  {
    title: 'TensorFlow pour le Machine Learning',
    branch: 'IA',
    youtubeUrl: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
    description: 'Apprenez à utiliser TensorFlow pour le ML.',
  },
  {
    title: 'Introduction à DevOps',
    branch: 'DevOps',
    youtubeUrl: 'https://www.youtube.com/watch?v=Wvf0mBNGjXY',
    description: 'Les bases de DevOps et CI/CD.',
  },
  {
    title: 'Docker pour débutants',
    branch: 'DevOps',
    youtubeUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
    description: 'Apprenez à conteneuriser vos applications avec Docker.',
  },
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB pour seeding');

    await Course.deleteMany({});
    console.log('Cours existants supprimés');

    await Course.insertMany(courses);
    console.log('Cours seedés avec succès');

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    mongoose.connection.close();
  }
};

seedCourses();