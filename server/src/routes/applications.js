const express = require('express');
const { 
  applyForJob, 
  getEmployerApplications, 
  getCandidateApplications, 
  getApplication, 
  updateApplicationStatus, 
  recordHoursWorked, 
  validateHoursWorked, 
  submitEmployerFeedback, 
  submitCandidateFeedback 
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes de base
router.post('/', protect, applyForJob);
router.get('/employer', protect, getEmployerApplications);
router.get('/candidate', protect, getCandidateApplications);
router.get('/:id', protect, getApplication);

// Routes pour la gestion des candidatures
router.put('/:id/status', protect, updateApplicationStatus);

// Routes pour la gestion des heures travaillées
router.post('/:id/hours', protect, recordHoursWorked);
router.put('/:id/hours/:hourId/validate', protect, validateHoursWorked);

// Routes pour les avis
router.post('/:id/feedback/employer', protect, submitEmployerFeedback);
router.post('/:id/feedback/candidate', protect, submitCandidateFeedback);

module.exports = router;
