// URLs des images par branche (key = nom de branche en minuscule)
export const BRANCH_IMAGES = {
  web: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  'data science': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  devops: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
  cybersecurity: 'https://www.theforage.com/blog/wp-content/uploads/2022/12/what-is-cybersecurity.jpg',
  ia: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
};

// URLs des images pour les cours populaires
export const COURSE_IMAGES = {
  pythonDeveloper: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  reactBeginner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  introToAI: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  devopsDocker: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
};

// URLs des images placeholder
export const PLACEHOLDER_IMAGES = {
  default: 'https://via.placeholder.com/400x300?text=Image+Not+Available',
  course: 'https://via.placeholder.com/300x200?text=Course',
  branch: 'https://via.placeholder.com/400x300?text=Branch',
  user: 'https://via.placeholder.com/150x150?text=User',
};

/**
 * Obtenir l'image d'une branche par son nom
 * @param {string} branchName - Nom de la branche
 * @returns {string} URL de l'image
 */
export const getBranchImage = (branchName) => {
  const key = branchName?.toLowerCase().trim();
  return BRANCH_IMAGES[key] || BRANCH_IMAGES.web;
};

/**
 * Obtenir l'image d'un cours par le nom de la branche
 * @param {string} branchName - Nom de la branche
 * @returns {string} URL de l'image
 */
export const getCourseImage = (branchName) => {
  return getBranchImage(branchName);
};
