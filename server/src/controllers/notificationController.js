const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Obtenir toutes les notifications d'un utilisateur
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des notifications'
    });
  }
};

/**
 * @desc    Obtenir le nombre de notifications non lues
 * @route   GET /api/notifications/unread/count
 * @access  Private
 */
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du comptage des notifications non lues'
    });
  }
};

/**
 * @desc    Marquer une notification comme lue
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette notification'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du marquage de la notification'
    });
  }
};

/**
 * @desc    Marquer toutes les notifications comme lues
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du marquage des notifications'
    });
  }
};

/**
 * @desc    Supprimer une notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette notification'
      });
    }

    await notification.remove();

    res.json({
      success: true,
      message: 'Notification supprimée'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la notification'
    });
  }
};

/**
 * @desc    Créer une notification (fonction interne)
 * @access  Private
 */
const createNotification = async (recipientId, type, title, message, relatedTo = {}) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      title,
      message,
      relatedTo
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return null;
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
