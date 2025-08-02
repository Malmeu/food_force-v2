// Configuration de l'application

// URL de base de l'API
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Configuration des secteurs d'activité
export const SECTORS_OBJECTS = [
  { value: 'restaurant', label: 'Restauration' },
  { value: 'hotel', label: 'Hôtellerie' },
  { value: 'event', label: 'Événementiel' },
  { value: 'cafe', label: 'Café/Bar' },
  { value: 'catering', label: 'Traiteur' },
  { value: 'bakery', label: 'Boulangerie/Pâtisserie' },
  { value: 'nightclub', label: 'Boite de nuit/Club' }
];

// Version simplifiée pour les composants qui n'utilisent que les valeurs
export const SECTORS = SECTORS_OBJECTS.map(sector => sector.value);

// Alias pour la compatibilité avec les composants existants
export const sectors = SECTORS;

// Configuration des types de contrats
export const CONTRACT_TYPES_OBJECTS = [
  { value: 'cdi', label: 'CDI' },
  { value: 'cdd', label: 'CDD' },
  { value: 'interim', label: 'Intérim' },
  { value: 'extra', label: 'Extra' },
  { value: 'seasonal', label: 'Saisonnier' },
  { value: 'internship', label: 'Stage' }
];

// Version simplifiée pour les composants qui n'utilisent que les valeurs
export const CONTRACT_TYPES = CONTRACT_TYPES_OBJECTS.map(type => type.value);

// Alias pour la compatibilité avec les composants existants
export const contractTypes = CONTRACT_TYPES;

// Configuration des niveaux d'expérience
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'experienced', label: 'Expérimenté' },
  { value: 'expert', label: 'Expert' }
];

// Alias pour la compatibilité avec les composants existants
export const experienceLevels = EXPERIENCE_LEVELS;

// Configuration des niveaux d'éducation
export const EDUCATION_LEVELS = [
  'Aucun diplôme',
  'Bac',
  'Bac+2',
  'Bac+3',
  'Bac+5',
  'Doctorat'
];

// Configuration des principales villes du Maroc
export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'El Jadida',
  'Safi',
  'Mohammedia',
  'Essaouira',
  'Ifrane'
];

// Configuration des compétences courantes
export const COMMON_SKILLS = [
  'Service en salle',
  'Barman',
  'Cuisine',
  'Pâtisserie',
  'Réception',
  'Housekeeping',
  'Gestion d\'événements',
  'Vente',
  'Logistique',
  'Livraison',
  'Management',
  'Langues étrangères',
  'Sommellerie',
  'Accueil client',
  'Caisse'
];

// Configuration des périodes de salaire
export const SALARY_PERIODS = [
  'Heure',
  'Jour',
  'Mois'
];

// Configuration des jours de la semaine
export const DAYS_OF_WEEK = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
];

// Configuration des tailles d'entreprise
export const COMPANY_SIZES = [
  '1-10 employés',
  '11-50 employés',
  '51-200 employés',
  '201+ employés'
];
