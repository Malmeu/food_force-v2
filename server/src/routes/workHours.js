const express = require('express');
const { protect } = require('../middleware/auth');
const {
  recordWorkHours,
  getMissionWorkHours,
  validateWorkHours,
  rejectWorkHours,
  getCandidateWorkHours,
  getEstablishmentWorkHours
} = require('../controllers/workHoursController');

const router = express.Router();

// Routes pour les heures travaillu00e9es
router.route('/')
  .post(protect, recordWorkHours);

router.route('/mission/:missionId')
  .get(protect, getMissionWorkHours);

router.route('/candidate')
  .get(protect, getCandidateWorkHours);

router.route('/establishment')
  .get(protect, getEstablishmentWorkHours);

router.route('/:id/validate')
  .put(protect, validateWorkHours);

router.route('/:id/reject')
  .put(protect, rejectWorkHours);

module.exports = router;
