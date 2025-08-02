const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validator');
const { body } = require('express-validator');
const {
  sendMessage,
  getConversations,
  getConversation,
  getUnreadCount,
  deleteMessage
} = require('../controllers/messageController');

// Validation pour l'envoi de message
const sendMessageValidation = [
  body('recipientId').isMongoId().withMessage('ID de destinataire invalide'),
  body('content').notEmpty().withMessage('Le contenu du message est requis')
];

// Routes pour les messages
router.post('/', protect, sendMessageValidation, validateRequest, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread/count', protect, getUnreadCount);
router.get('/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
