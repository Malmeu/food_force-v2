const mongoose = require('mongoose');

// Schu00e9ma pour les u00e9valuations et avis
const ratingSchema = new mongoose.Schema({
  // Utilisateur qui donne l'u00e9valuation
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Utilisateur qui reu00e7oit l'u00e9valuation
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Application liu00e9e u00e0 cette u00e9valuation
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  // Note (de 1 u00e0 5)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Commentaire
  comment: {
    type: String,
    maxlength: 500
  },
  // Type d'u00e9valuation (candidat u00e9value u00e9tablissement ou vice versa)
  ratingType: {
    type: String,
    enum: ['candidate_to_establishment', 'establishment_to_candidate'],
    required: true
  },
  // Compu00e9tences u00e9valuu00e9es (pour les u00e9valuations d'u00e9tablissement vers candidat)
  skills: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }],
  // Critu00e8res u00e9valuu00e9s (pour les u00e9valuations de candidat vers u00e9tablissement)
  criteria: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre u00e0 jour la date de modification
ratingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Mu00e9thode statique pour calculer la note moyenne d'un utilisateur
ratingSchema.statics.calculateAverageRating = async function(userId) {
  const result = await this.aggregate([
    { $match: { rated: mongoose.Types.ObjectId(userId) } },
    { $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 
    ? { average: result[0].averageRating, count: result[0].totalRatings } 
    : { average: 0, count: 0 };
};

// Index pour amu00e9liorer les performances des requu00eates
ratingSchema.index({ rated: 1 });
ratingSchema.index({ rater: 1 });
ratingSchema.index({ application: 1 });

// Assurer qu'un utilisateur ne peut u00e9valuer qu'une seule fois par candidature
ratingSchema.index({ rater: 1, application: 1, ratingType: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
