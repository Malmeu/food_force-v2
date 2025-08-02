const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');
const { body } = require('express-validator');
const {
  createPayment,
  createMissionPayment,
  updatePaymentStatus,
  getEmployerPayments,
  getCandidatePayments,
  getPaymentById,
  getEmployerPaymentStats,
  getMissionPayments
} = require('../controllers/paymentController');

// Validation pour la création de paiement lié à une candidature
const createPaymentValidation = [
  body('applicationId').isMongoId().withMessage('ID de candidature invalide'),
  body('amount').isNumeric().withMessage('Le montant doit être un nombre'),
  body('hoursWorked').isNumeric().withMessage('Les heures travaillées doivent être un nombre'),
  body('paymentMethod').isIn(['bank_transfer', 'cash', 'mobile_payment', 'check']).withMessage('Méthode de paiement invalide')
];

// Validation pour la création de paiement lié à une mission
const createMissionPaymentValidation = [
  body('missionId').isMongoId().withMessage('ID de mission invalide'),
  body('amount').isNumeric().withMessage('Le montant doit être un nombre'),
  body('paymentMethod').isIn(['bank_transfer', 'cash', 'mobile_payment', 'check']).withMessage('Méthode de paiement invalide')
];

// Validation pour la mise à jour du statut de paiement
const updatePaymentStatusValidation = [
  body('status').isIn(['En attente', 'Traité', 'Payé']).withMessage('Statut de paiement invalide')
];

// Routes pour les paiements liés aux candidatures
router.post('/', protect, authorize('etablissement'), createPaymentValidation, validateRequest, createPayment);

// Routes pour les paiements liés aux missions
router.post('/mission', protect, authorize('etablissement'), createMissionPaymentValidation, validateRequest, createMissionPayment);
router.get('/mission/:missionId', protect, getMissionPayments);

// Routes communes
router.put('/:id/status', protect, authorize('etablissement'), updatePaymentStatusValidation, validateRequest, updatePaymentStatus);
router.get('/employer', protect, authorize('etablissement'), getEmployerPayments);
router.get('/candidate', protect, authorize('candidat'), getCandidatePayments);
router.get('/employer/stats', protect, authorize('etablissement'), getEmployerPaymentStats);
router.get('/:id', protect, getPaymentById);

module.exports = router;
