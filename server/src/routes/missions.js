const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createMission,
  getEstablishmentMissions,
  getCandidateMissions,
  getMission,
  updateMission,
  updateMissionStatus,
  deleteMission
} = require('../controllers/missionController');

const router = express.Router();

// Routes pour les missions
router.route('/')
  .post(protect, createMission);

router.route('/establishment')
  .get(protect, getEstablishmentMissions);

router.route('/candidate')
  .get(protect, getCandidateMissions);

router.route('/:id')
  .get(protect, getMission)
  .put(protect, updateMission)
  .delete(protect, deleteMission);

router.route('/:id/status')
  .put(protect, updateMissionStatus);

module.exports = router;
