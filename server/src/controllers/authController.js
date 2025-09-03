const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail, generateVerificationEmailTemplate } = require('../utils/email');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { userType, email, password, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer un token de vérification
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Créer l'utilisateur
    const user = await User.create({
      userType,
      email,
      password,
      phone,
      verificationToken,
      verificationExpire
    });

    // Envoyer l'email de vérification
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    const message = `Vous recevez cet email car vous vous êtes inscrit sur FoodForce Maroc. Veuillez cliquer sur le lien suivant pour vérifier votre compte : \n\n ${verificationUrl}`;
    const htmlTemplate = generateVerificationEmailTemplate(null, verificationUrl);

    try {
      console.log('Tentative d\'envoi d\'email de vérification à:', user.email);
      
      // Vérifier si nous sommes en mode développement
      if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USERNAME) {
        console.log('Mode développement détecté et configuration email manquante - Inscription sans email');
        // En développement, on peut continuer sans envoyer d'email
        user.isVerified = true; // Auto-vérification en développement
        await user.save();
        
        return res.status(201).json({
          success: true,
          message: 'Utilisateur créé et automatiquement vérifié (mode développement).',
          verificationUrl // Inclure l'URL pour référence
        });
      } else {
        // En production ou si la config email est présente, envoyer l'email
        await sendEmail({
          email: user.email,
          subject: 'Vérification de votre compte FoodForce Maroc',
          message,
          html: htmlTemplate
        });
      }

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé. Un email de vérification a été envoyé.'
      });
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email:', err);
      
      // En mode développement, on peut continuer sans email
      if (process.env.NODE_ENV === 'development') {
        user.isVerified = true; // Auto-vérification en développement
        await user.save();
        
        return res.status(201).json({
          success: true,
          message: 'Utilisateur créé et automatiquement vérifié (mode développement - échec email).',
          error: err.message
        });
      }
      
      user.verificationToken = undefined;
      user.verificationExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'L\'email n\'a pas pu être envoyé'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Vérifier un compte utilisateur
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyAccount = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationToken: req.params.token,
      verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré'
      });
    }

    // Mettre à jour le statut de vérification
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Compte vérifié avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du compte',
      error: error.message
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider l'email et le mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Temporairement désactivé pour les tests
    // Vérifier si le compte est vérifié
    /*if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre compte avant de vous connecter'
      });
    }*/

    // Créer un token
    const token = generateToken(user._id);
    
    // Récupérer les données complètes de l'utilisateur sans le mot de passe
    const userData = await User.findById(user._id);
    const userObject = userData.toObject();
    delete userObject.password;
    
    console.log('Données utilisateur complètes renvoyées lors de la connexion');
    
    res.status(200).json({
      success: true,
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Obtenir l'utilisateur actuellement connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    console.log('Récupération des données utilisateur pour ID:', req.user.id);
    
    // Utiliser populate pour obtenir toutes les données associées
    const user = await User.findById(req.user.id).select('+candidateProfile +establishmentProfile');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    console.log('Données utilisateur trouvées:', {
      id: user._id,
      email: user.email,
      userType: user.userType,
      hasCandidateProfile: !!user.candidateProfile,
      hasEstablishmentProfile: !!user.establishmentProfile
    });
    
    // Préparer les données de réponse
    const userData = user.toObject();
    
    // Si c'est un candidat, aplatir les données du profil candidat au niveau supérieur
    if (user.userType === 'candidat' && user.candidateProfile) {
      Object.keys(user.candidateProfile).forEach(key => {
        if (!userData[key]) {
          userData[key] = user.candidateProfile[key];
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données utilisateur',
      error: error.message
    });
  }
};

// @desc    Mot de passe oublié
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Aucun utilisateur avec cet email'
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hasher le token et le stocker dans la base de données
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Créer l'URL de réinitialisation
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email envoyé'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'L\'email n\'a pas pu être envoyé'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation du mot de passe',
      error: error.message
    });
  }
};

// @desc    Réinitialiser le mot de passe
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Hasher le token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }

    // Définir le nouveau mot de passe
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le mot de passe
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Définir le nouveau mot de passe
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};
