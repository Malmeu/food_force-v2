const mongoose = require('mongoose');

// Schéma pour les messages entre utilisateurs
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  // Si le message est lié à une candidature
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  // Si le message est lié à une offre d'emploi
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode pour marquer un message comme lu
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = Date.now();
  return this.save();
};

// Méthode statique pour obtenir les conversations d'un utilisateur
messageSchema.statics.getConversations = async function(userId) {
  try {
    // Convertir userId en ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Récupérer tous les messages impliqués avec cet utilisateur
    const messages = await this.find({
      $or: [
        { sender: userObjectId },
        { recipient: userObjectId }
      ]
    }).sort({ createdAt: -1 }).populate('sender recipient');
    
    // Regrouper les messages par conversation (par utilisateur)
    const conversationsMap = new Map();
    
    for (const message of messages) {
      // Déterminer l'autre utilisateur dans la conversation
      const otherUserId = message.sender._id.toString() === userId 
        ? message.recipient._id.toString() 
        : message.sender._id.toString();
      
      // Si cette conversation n'est pas encore dans la map, l'ajouter
      if (!conversationsMap.has(otherUserId)) {
        const otherUser = message.sender._id.toString() === userId 
          ? message.recipient 
          : message.sender;
        
        conversationsMap.set(otherUserId, {
          _id: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      // Compter les messages non lus
      if (message.recipient._id.toString() === userId && !message.isRead) {
        const conversation = conversationsMap.get(otherUserId);
        conversation.unreadCount += 1;
      }
    }
    
    // Convertir la map en tableau et trier par date du dernier message
    const conversations = Array.from(conversationsMap.values());
    conversations.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);
    
    return conversations;
  } catch (error) {
    console.error('Erreur dans getConversations:', error);
    return [];
  }
};

// Index pour améliorer les performances des requêtes
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });
messageSchema.index({ application: 1 });
messageSchema.index({ job: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
