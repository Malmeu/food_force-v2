const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Veuillez fournir un titre pour le poste'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'Veuillez fournir une description du poste']
  },
  contractType: {
    type: String,
    enum: ['Permanent', 'Temporaire', 'Intérim', 'Extra', 'Saisonnier', 'Stage'],
    required: [true, 'Veuillez spécifier le type de contrat']
  },
  sector: {
    type: String,
    enum: ['Restauration', 'Hôtellerie', 'Événementiel', 'Vente', 'Logistique'],
    required: [true, 'Veuillez spécifier le secteur d\'activité']
  },
  location: {
    address: String,
    city: {
      type: String,
      required: [true, 'Veuillez spécifier la ville']
    },
    region: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  salary: {
    amount: {
      type: Number,
      required: [true, 'Veuillez spécifier le montant du salaire']
    },
    period: {
      type: String,
      enum: ['Heure', 'Jour', 'Mois'],
      required: [true, 'Veuillez spécifier la période du salaire']
    },
    currency: {
      type: String,
      default: 'MAD'
    }
  },
  requiredSkills: [String],
  workingHours: {
    start: String,
    end: String
  },
  workingDays: [{
    type: String,
    enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  }],
  startDate: {
    type: Date,
    required: [true, 'Veuillez spécifier la date de début']
  },
  endDate: Date, // Optionnel pour les contrats temporaires
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  applicationDeadline: Date,
  numberOfPositions: {
    type: Number,
    default: 1
  },
  experienceLevel: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Expérimenté', 'Expert'],
    required: [true, 'Veuillez spécifier le niveau d\'expérience requis']
  },
  educationLevel: {
    type: String,
    enum: ['Aucun diplôme', 'Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Doctorat']
  },
  benefits: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mise à jour de la date de modification avant chaque sauvegarde
JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour la recherche géospatiale
JobSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Job', JobSchema);
