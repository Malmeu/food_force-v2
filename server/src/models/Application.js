const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['En attente', 'Examinée', 'Entretien', 'Acceptée', 'Refusée'],
    default: 'En attente'
  },
  coverLetter: String,
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Pour les missions acceptées
  mission: {
    startDate: Date,
    endDate: Date,
    hoursWorked: [{
      date: Date,
      hours: Number,
      validated: {
        byEmployer: Boolean,
        byCandidate: Boolean
      }
    }],
    totalHours: {
      type: Number,
      default: 0
    },
    payment: {
      status: {
        type: String,
        enum: ['En attente', 'Traité', 'Payé'],
        default: 'En attente'
      },
      amount: Number,
      date: Date,
      transactionId: String
    }
  },
  feedback: {
    fromEmployer: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: Date
    },
    fromCandidate: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: Date
    }
  }
});

// Mise à jour de la date de modification avant chaque sauvegarde
ApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);
