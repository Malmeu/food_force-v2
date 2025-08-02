const { body } = require('express-validator');

// Validations pour l'authentification
const registerValidation = [
  body('email').isEmail().withMessage('Veuillez fournir un email valide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('userType').isIn(['candidat', 'etablissement']).withMessage('Le type d\'utilisateur doit être candidat ou etablissement'),
  body('phone').notEmpty().withMessage('Le numéro de téléphone est requis')
];

const loginValidation = [
  body('email').isEmail().withMessage('Veuillez fournir un email valide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Veuillez fournir un email valide')
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validations pour les offres d'emploi
const createJobValidation = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('contractType').isIn(['CDI', 'CDD', 'Intérim', 'Extra']).withMessage('Type de contrat invalide'),
  body('sector').isIn(['Restauration', 'Hôtellerie', 'Événementiel', 'Vente', 'Logistique']).withMessage('Secteur invalide'),
  body('location.city').notEmpty().withMessage('La ville est requise'),
  body('salary.amount').isNumeric().withMessage('Le montant du salaire doit être un nombre'),
  body('salary.period').isIn(['Heure', 'Jour', 'Mois']).withMessage('Période de salaire invalide'),
  body('startDate').isISO8601().withMessage('La date de début doit être une date valide')
];

// Validations pour les candidatures
const applyForJobValidation = [
  body('job').isMongoId().withMessage('ID d\'offre d\'emploi invalide')
];

const updateApplicationStatusValidation = [
  body('status').isIn(['En attente', 'Examinée', 'Entretien', 'Acceptée', 'Refusée']).withMessage('Statut invalide')
];

const recordHoursWorkedValidation = [
  body('date').isISO8601().withMessage('La date doit être une date valide'),
  body('hours').isNumeric().withMessage('Les heures doivent être un nombre')
];

const feedbackValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5')
];

// Validations pour les profils utilisateurs
const updateProfileValidation = [
  body('phone').optional().notEmpty().withMessage('Le numéro de téléphone ne peut pas être vide'),
  body('address.city').optional().notEmpty().withMessage('La ville ne peut pas être vide'),
  body('candidateProfile.firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('candidateProfile.lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('establishmentProfile.name').optional().notEmpty().withMessage('Le nom de l\'établissement ne peut pas être vide'),
  body('establishmentProfile.sector').optional().isIn(['Restauration', 'Hôtellerie', 'Événementiel', 'Vente', 'Logistique']).withMessage('Secteur invalide')
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  createJobValidation,
  applyForJobValidation,
  updateApplicationStatusValidation,
  recordHoursWorkedValidation,
  feedbackValidation,
  updateProfileValidation
};
