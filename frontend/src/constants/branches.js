// Constantes des branches d'études
export const BRANCHES = {
  WEB_DEVELOPMENT: {
    id: 'web',
    name: 'Développement Web',
    description: 'HTML, CSS, JavaScript, React, Vue, Angular',
    icon: 'code',
  },
  DATA_SCIENCE: {
    id: 'data-science',
    name: 'Data Science & Python',
    description: 'Python, Pandas, NumPy, Machine Learning',
    icon: 'chart',
  },
  MOBILE_DEV: {
    id: 'mobile',
    name: 'Développement Mobile',
    description: 'React Native, Flutter, Swift',
    icon: 'mobile',
  },
  DEVOPS: {
    id: 'devops',
    name: 'DevOps & Cloud',
    description: 'Docker, Kubernetes, AWS, Azure',
    icon: 'server',
  },
  CYBERSECURITY: {
    id: 'cybersecurity',
    name: 'Cybersécurité',
    description: 'Sécurité réseau, Ethical Hacking',
    icon: 'shield',
  },
  CLOUD_COMPUTING: {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'AWS, Google Cloud, Microsoft Azure',
    icon: 'cloud',
  },
};

export const BRANCH_NAMES = Object.values(BRANCHES).map((b) => b.name);
