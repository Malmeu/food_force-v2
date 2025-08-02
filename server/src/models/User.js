const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['candidat', 'etablissement'],
    required: true
  },
  email: {
    type: String,
    required: [true, 'Veuillez fournir un email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir un email valide'
    ]
  },
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe'],
    minlength: 6,
    select: false
  },
  // Champs communs
  phone: {
    type: String,
    required: [true, 'Veuillez fournir un numéro de téléphone']
  },
  address: {
    street: String,
    city: String,
    region: String,
    postalCode: String,
    country: { type: String, default: 'Maroc' }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Champs spécifiques aux candidats
  candidateProfile: {
    firstName: String,
    lastName: String,
    birthDate: Date,
    profilePicture: String,
    resume: String,
    skills: [String],
    experiences: [{
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String
    }],
    availability: [{
      day: String,
      timeSlots: [{
        start: String,
        end: String
      }]
    }],
    preferredSectors: {
      type: [String],
      enum: ['Bar', 'Restaurant', 'Restaurant collectif']
    },
    preferredContractTypes: {
      type: [String],
      enum: ['Permanent', 'Temporaire', 'Intérim', 'Extra', 'Saisonnier', 'Stage']
    }
  },
  
  // Champs spécifiques aux établissements
  establishmentProfile: {
    name: String,
    logo: String,
    description: String,
    website: String,
    sector: {
      type: String,
      enum: ['Bar', 'Restaurant', 'Restaurant collectif']
    },
    servesAlcohol: {
      type: Boolean,
      default: false
    },
    companySize: String,
    foundedYear: Number,
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String
    },
    contactPerson: {
      firstName: String,
      lastName: String,
      position: String,
      email: String,
      phone: String
    }
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

// Crypter le mot de passe avant l'enregistrement
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
