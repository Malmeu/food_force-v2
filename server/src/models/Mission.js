const mongoose = require('mongoose');
const { MISSION_STATUS, MISSION_PRIORITY } = require('../config/constants');

// Schéma pour les missions assignées aux candidats
const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre de la mission est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description de la mission est requise'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'établissement est requis']
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le candidat est requis']
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: [true, 'La candidature associée est requise']
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  status: {
    type: String,
    enum: Object.values(MISSION_STATUS),
    default: MISSION_STATUS.PENDING
  },
  priority: {
    type: String,
    enum: Object.values(MISSION_PRIORITY),
    default: MISSION_PRIORITY.MEDIUM
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Le taux horaire est requis'],
    min: [0, 'Le taux horaire ne peut pas être négatif']
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Le nombre d\'heures estimé est requis'],
    min: [0, 'Le nombre d\'heures estimé ne peut pas être négatif']
  },
  actualHours: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre d\'heures réel ne peut pas être négatif']
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de modification
missionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour calculer le montant total de la mission
missionSchema.methods.calculateTotalAmount = function() {
  return this.actualHours * this.hourlyRate;
};

// Méthode pour calculer le montant estimé de la mission
missionSchema.methods.calculateEstimatedAmount = function() {
  return this.estimatedHours * this.hourlyRate;
};

module.exports = mongoose.model('Mission', missionSchema);
