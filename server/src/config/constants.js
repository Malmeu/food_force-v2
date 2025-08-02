// Constantes de l'application

// Types d'utilisateurs
const USER_TYPES = {
  CANDIDATE: 'candidat',
  ESTABLISHMENT: 'etablissement',
};

// Types de contrats
const CONTRACT_TYPES = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERIM: 'Intu00e9rim',
  EXTRA: 'Extra',
};

// Secteurs d'activitu00e9
const SECTORS = {
  RESTAURANT: 'Restauration',
  HOTEL: 'Hu00f4tellerie',
  EVENT: 'u00c9vu00e9nementiel',
  SALES: 'Vente',
  LOGISTICS: 'Logistique',
};

// Statuts de candidature
const APPLICATION_STATUS = {
  PENDING: 'En attente',
  REVIEWED: 'Examinu00e9e',
  INTERVIEW: 'Entretien',
  ACCEPTED: 'Acceptu00e9e',
  REJECTED: 'Refusu00e9e',
};

// Pu00e9riodes de salaire
const SALARY_PERIODS = {
  HOUR: 'Heure',
  DAY: 'Jour',
  MONTH: 'Mois',
};

// Niveaux d'expu00e9rience
const EXPERIENCE_LEVELS = {
  BEGINNER: 'Du00e9butant',
  INTERMEDIATE: 'Intermu00e9diaire',
  EXPERIENCED: 'Expu00e9rimentu00e9',
  EXPERT: 'Expert',
};

// Niveaux d'u00e9ducation
const EDUCATION_LEVELS = {
  NONE: 'Aucun diplu00f4me',
  BAC: 'Bac',
  BAC_2: 'Bac+2',
  BAC_3: 'Bac+3',
  BAC_5: 'Bac+5',
  PHD: 'Doctorat',
};

// Jours de la semaine
const DAYS_OF_WEEK = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
};

// Statuts de mission
const MISSION_STATUS = {
  PENDING: 'en attente',
  IN_PROGRESS: 'en cours',
  COMPLETED: 'terminu00e9e',
  CANCELLED: 'annulu00e9e',
};

// Prioritu00e9s de mission
const MISSION_PRIORITY = {
  LOW: 'basse',
  MEDIUM: 'moyenne',
  HIGH: 'haute',
};

// Statuts de paiement
const PAYMENT_STATUS = {
  PENDING: 'En attente',
  PROCESSED: 'Traitu00e9',
  PAID: 'Payu00e9',
};

// Tailles d'entreprise
const COMPANY_SIZES = {
  SMALL: '1-10 employu00e9s',
  MEDIUM: '11-50 employu00e9s',
  LARGE: '51-200 employu00e9s',
  ENTERPRISE: '201+ employu00e9s',
};

module.exports = {
  USER_TYPES,
  CONTRACT_TYPES,
  SECTORS,
  APPLICATION_STATUS,
  SALARY_PERIODS,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  DAYS_OF_WEEK,
  MISSION_STATUS,
  MISSION_PRIORITY,
  PAYMENT_STATUS,
  COMPANY_SIZES,
};
