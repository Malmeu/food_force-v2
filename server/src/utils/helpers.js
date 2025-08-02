// Fonctions d'aide diverses

/**
 * Génère une chaîne aléatoire de la longueur spécifiée
 * @param {number} length - Longueur de la chaîne à générer
 * @returns {string} - Chaîne aléatoire
 */
const generateRandomString = (length = 20) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Calcule la distance entre deux points géographiques (formule de Haversine)
 * @param {number} lat1 - Latitude du premier point
 * @param {number} lon1 - Longitude du premier point
 * @param {number} lat2 - Latitude du deuxième point
 * @param {number} lon2 - Longitude du deuxième point
 * @returns {number} - Distance en kilomètres
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km
  
  return distance;
};

/**
 * Convertit des degrés en radians
 * @param {number} deg - Degrés
 * @returns {number} - Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Formate une date en chaîne de caractères
 * @param {Date} date - Date à formater
 * @param {string} format - Format de la date (par défaut: DD/MM/YYYY)
 * @returns {string} - Date formatée
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  let formattedDate = format;
  formattedDate = formattedDate.replace('DD', day);
  formattedDate = formattedDate.replace('MM', month);
  formattedDate = formattedDate.replace('YYYY', year);
  
  return formattedDate;
};

/**
 * Tronque un texte à la longueur spécifiée
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué
 */
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calcule le score de correspondance entre un candidat et une offre d'emploi
 * @param {Object} candidate - Profil du candidat
 * @param {Object} job - Offre d'emploi
 * @returns {number} - Score de correspondance (0-100)
 */
const calculateMatchScore = (candidate, job) => {
  let score = 0;
  const maxScore = 100;
  
  // Vérifier les secteurs préférés
  if (candidate.candidateProfile?.preferredSectors?.includes(job.sector)) {
    score += 20;
  }
  
  // Vérifier les types de contrats préférés
  if (candidate.candidateProfile?.preferredContractTypes?.includes(job.contractType)) {
    score += 20;
  }
  
  // Vérifier les compétences
  const candidateSkills = candidate.candidateProfile?.skills || [];
  const requiredSkills = job.requiredSkills || [];
  
  if (requiredSkills.length > 0) {
    const matchingSkills = requiredSkills.filter(skill => 
      candidateSkills.includes(skill)
    );
    
    score += (matchingSkills.length / requiredSkills.length) * 40;
  } else {
    score += 40; // Si aucune compétence n'est requise, score maximum
  }
  
  // Vérifier la localisation
  if (candidate.address?.city === job.location?.city) {
    score += 20;
  }
  
  return Math.min(Math.round(score), maxScore);
};

module.exports = {
  generateRandomString,
  calculateDistance,
  formatDate,
  truncateText,
  calculateMatchScore,
};
