const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');
const { body } = require('express-validator');
const {
  createRating,
  getUserRatings,
  getGivenRatings,
  getReceivedRatings,
  getRatingById,
  updateRating,
  deleteRating
} = require('../controllers/ratingController');

// Validation pour la cru00e9ation d'u00e9valuation
const createRatingValidation = [
  body('applicationId').isMongoId().withMessage('ID de candidature invalide'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit u00eatre entre 1 et 5'),
  body('ratingType').isIn(['candidate_to_establishment', 'establishment_to_candidate']).withMessage('Type d\'u00e9valuation invalide')
];

// Validation pour la mise u00e0 jour d'u00e9valuation
const updateRatingValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('La note doit u00eatre entre 1 et 5')
];

// Routes pour les u00e9valuations
router.post('/', protect, createRatingValidation, validateRequest, createRating);
router.get('/user/:userId', getUserRatings);
router.get('/given', protect, getGivenRatings);
router.get('/received', protect, getReceivedRatings);
router.get('/:id', getRatingById);
router.put('/:id', protect, updateRatingValidation, validateRequest, updateRating);
router.delete('/:id', protect, deleteRating);

module.exports = router;
