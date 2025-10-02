const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const courses = [
  // Web (6)
  { title: 'HTML & CSS Crash Course', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=hu-q2z7e4pk', description: 'Bases HTML/CSS.' },
  { title: 'JavaScript pour débutants', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', description: 'Intro JS.' },
  { title: 'React Tutorial', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk', description: 'Apprenez React.' },
  { title: 'Node.js Basics', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=TlB_eWDS0E4', description: 'Backend JS.' },
  { title: 'Responsive Design', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=0pTh1RBeGzo', description: 'Design mobile.' },
  { title: 'Tailwind CSS Guide', branch: 'Web', youtubeUrl: 'https://www.youtube.com/watch?v=ft30zcMlFao', description: 'Styling rapide.' },

  // IA (6)
  { title: 'Introduction à l’IA avec Python', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', description: 'Bases IA.' },
  { title: 'TensorFlow pour ML', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=tPYj3fFJGjk', description: 'TensorFlow.' },
  { title: 'Machine Learning Crash Course', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=7eh4d6sabA0', description: 'ML intro.' },
  { title: 'Neural Networks', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', description: 'Réseaux neuronaux.' },
  { title: 'NLP Basics', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=vyOgWhwUmec', description: 'Traitement langage.' },
  { title: 'Computer Vision', branch: 'IA', youtubeUrl: 'https://www.youtube.com/watch?v=1vAuF1TD_3A', description: 'Vision IA.' },

  // DevOps (4)
  { title: 'Introduction à DevOps', branch: 'DevOps', youtubeUrl: 'https://www.youtube.com/watch?v=Wvf0mBNGjXY', description: 'Bases DevOps.' },
  { title: 'Docker pour débutants', branch: 'DevOps', youtubeUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', description: 'Conteneurs.' },
  { title: 'Kubernetes Intro', branch: 'DevOps', youtubeUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do', description: 'Orchestration.' },
  { title: 'CI/CD Pipeline', branch: 'DevOps', youtubeUrl: 'https://www.youtube.com/watch?v=4v2S2o8qW2A', description: 'Pipelines.' },

  // Cybersecurity (2)
  { title: 'Cybersecurity Basics', branch: 'Cybersecurity', youtubeUrl: 'https://www.youtube.com/watch?v=8LqGYW1HMrM', description: 'Sécurité intro.' },
  { title: 'Ethical Hacking', branch: 'Cybersecurity', youtubeUrl: 'https://www.youtube.com/watch?v=0s0hL3h3l2o', description: 'Hacking éthique.' },

  // Data Science (2)
  { title: 'Python for Data Science', branch: 'Data Science', youtubeUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg', description: 'Python data.' },
  { title: 'Pandas Tutorial', branch: 'Data Science', youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg', description: 'Manipulation data.' },
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