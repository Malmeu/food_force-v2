const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('../config/constants');

// Schéma pour les paiements
const paymentSchema = new mongoose.Schema({
  // Référence à la mission ou à la candidature
  mission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission'
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  // Au moins une mission ou une candidature est requise
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  // Informations financières
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'MAD' // Dirham marocain
  },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  },
  // Informations sur le travail effectué
  hoursWorked: {
    type: Number,
    required: true
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  // Détails du paiement
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'cash', 'mobile_payment', 'check'],
    required: true
  },
  paymentDetails: {
    bankAccount: String,
    transactionId: String,
    checkNumber: String,
    notes: String
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  paymentDate: {
    type: Date
  },
  dueDate: {
    type: Date
  },
  // Métadonnées
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
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour améliorer les performances des requêtes
paymentSchema.index({ employer: 1, createdAt: -1 });
paymentSchema.index({ candidate: 1, createdAt: -1 });
paymentSchema.index({ application: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
