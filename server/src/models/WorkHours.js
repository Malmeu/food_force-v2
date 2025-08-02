const mongoose = require('mongoose');

// Schu00e9ma pour les heures travaillu00e9es par les candidats
const workHoursSchema = new mongoose.Schema({
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: [true, 'La mission associu00e9e est requise']
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le candidat est requis']
  },
  establishment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'u00e9tablissement est requis']
  },
  date: {
    type: Date,
    required: [true, 'La date est requise']
  },
  hours: {
    type: Number,
    required: [true, 'Le nombre d\'heures est requis'],
    min: [0.5, 'Le nombre d\'heures minimum est de 0.5'],
    max: [24, 'Le nombre d\'heures maximum est de 24']
  },
  description: {
    type: String,
    required: [true, 'La description des tu00e2ches effectuu00e9es est requise'],
    maxlength: [500, 'La description ne peut pas du00e9passer 500 caractu00e8res']
  },
  status: {
    type: String,
    enum: ['en attente', 'validu00e9', 'refusu00e9'],
    default: 'en attente'
  },
  validatedAt: {
    type: Date
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'La raison du refus ne peut pas du00e9passer 500 caractu00e8res']
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

// Middleware pour mettre u00e0 jour la date de modification
workHoursSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Mu00e9thode pour valider les heures
workHoursSchema.methods.validate = function(userId) {
  this.status = 'validu00e9';
  this.validatedAt = Date.now();
  this.validatedBy = userId;
  return this.save();
};

// Mu00e9thode pour refuser les heures
workHoursSchema.methods.reject = function(userId, reason) {
  this.status = 'refusu00e9';
  this.validatedAt = Date.now();
  this.validatedBy = userId;
  this.rejectionReason = reason;
  return this.save();
};

// Mu00e9thode statique pour calculer le total des heures pour une mission
workHoursSchema.statics.getTotalHoursForMission = async function(missionId) {
  const result = await this.aggregate([
    { $match: { mission: new mongoose.Types.ObjectId(missionId), status: 'validu00e9' } },
    { $group: { _id: null, totalHours: { $sum: '$hours' } } }
  ]);
  
  return result.length > 0 ? result[0].totalHours : 0;
};

module.exports = mongoose.model('WorkHours', workHoursSchema);
