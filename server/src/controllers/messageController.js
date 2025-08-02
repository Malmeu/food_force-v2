const Message = require('../models/Message');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

/**
 * @desc    Envoyer un message u00e0 un utilisateur
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { recipientId, content, applicationId, jobId } = req.body;

    // Vu00e9rifier que le destinataire existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvu00e9'
      });
    }

    // Cru00e9er le message
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      application: applicationId || null,
      job: jobId || null
    });

    await message.save();

    // Cru00e9er une notification pour le destinataire
    const senderName = req.user.userType === 'candidat' 
      ? `${req.user.candidateProfile?.firstName || ''} ${req.user.candidateProfile?.lastName || ''}`.trim() 
      : req.user.establishmentProfile?.name || 'Utilisateur';

    await createNotification(
      recipientId,
      'message',
      `Nouveau message de ${senderName}`,
      content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      { user: req.user.id }
    );

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'envoi du message'
    });
  }
};

/**
 * @desc    Obtenir les conversations de l'utilisateur
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getConversations = async (req, res) => {
  try {
    const conversations = await Message.getConversations(req.user.id);

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des conversations'
    });
  }
};

/**
 * @desc    Obtenir les messages d'une conversation avec un utilisateur
 * @route   GET /api/messages/:userId
 * @access  Private
 */
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Vu00e9rifier que l'utilisateur existe
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvu00e9'
      });
    }

    // Obtenir les messages entre les deux utilisateurs
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: otherUserId },
        { sender: otherUserId, recipient: req.user.id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'userType candidateProfile establishmentProfile')
    .populate('recipient', 'userType candidateProfile establishmentProfile');

    // Marquer les messages non lus comme lus
    await Message.updateMany(
      { sender: otherUserId, recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des messages'
    });
  }
};

/**
 * @desc    Obtenir le nombre de messages non lus
 * @route   GET /api/messages/unread/count
 * @access  Private
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du comptage des messages non lus'
    });
  }
};

/**
 * @desc    Supprimer un message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvu00e9'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'expu00e9diteur ou le destinataire
    if (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 supprimer ce message'
      });
    }

    await message.remove();

    res.json({
      success: true,
      message: 'Message supprimu00e9'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression du message'
    });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  getUnreadCount,
  deleteMessage
};
