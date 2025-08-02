const express = require('express');
// Utiliser le vrai contrôleur d'authentification
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updatePassword, 
  verifyAccount 
} = require('../controllers/authController');
// Utiliser le vrai middleware d'authentification
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.put('/update-password', protect, updatePassword);
router.get('/verify/:token', verifyAccount);

module.exports = router;
