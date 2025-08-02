const express = require('express');
const { 
  updateProfile, 
  getCandidateProfile, 
  getEstablishmentProfile, 
  uploadFile, 
  searchCandidates, 
  addRating 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Routes pour la gestion du profil
router.put('/profile', protect, updateProfile);
router.post('/upload', protect, upload.single('file'), uploadFile);

// Routes pour la recherche et l'affichage des profils
router.get('/candidates/search', protect, searchCandidates);
router.get('/candidates/:id', getCandidateProfile);
router.get('/establishments/:id', getEstablishmentProfile);

// Routes pour les u00e9valuations
router.post('/:id/ratings', protect, addRating);

module.exports = router;
