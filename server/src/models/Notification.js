const mongoose = require('mongoose');

// Schéma pour les notifications
const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['job', 'application', 'message', 'payment', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTo: {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode pour marquer une notification comme lue
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Index pour améliorer les performances des requêtes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
