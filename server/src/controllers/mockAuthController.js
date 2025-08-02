const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Générer un token JWT
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET || 'secret_dev_key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Inscription d'un utilisateur (simulation)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { userType: requestedType, email, password, phone, candidateProfile, establishmentProfile, address } = req.body;

    // Déterminer le type d'utilisateur final (utiliser celui fourni ou le déduire de l'email)
    const userType = requestedType || (email.includes('etablissement') ? 'etablissement' : 'candidat');
    
    console.log('Inscription simulée pour:', { userType, email, phone });
    
    // Générer un ID factice
    const userId = crypto.randomBytes(10).toString('hex');
    
    // Générer un token pour l'authentification
    const token = generateToken(userId, userType);

    // Créer un utilisateur factice pour le développement
    const user = {
      _id: userId,
      userType,
      email,
      phone,
      isVerified: true,
      createdAt: new Date(),
      candidateProfile: userType === 'candidat' ? candidateProfile : undefined,
      establishmentProfile: userType === 'etablissement' ? establishmentProfile : undefined,
      address
    };

    // Simuler un délai pour l'inscription
    setTimeout(() => {
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès. En mode développement, aucun email de vérification n\'est envoyé.',
        token,
        user
      });
    }, 500);
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Vérifier un compte utilisateur (simulation)
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyAccount = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Compte vérifié avec succès. En mode développement, tous les comptes sont automatiquement vérifiés.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification du compte',
      error: error.message
    });
  }
};

// @desc    Connexion d'un utilisateur (simulation)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification simple des identifiants
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Déterminer le type d'utilisateur en fonction de l'email
    const userType = email.includes('etablissement') ? 'etablissement' : 'candidat';
    
    // Générer un ID factice
    const userId = crypto.randomBytes(10).toString('hex');
    
    // Générer un token pour l'authentification
    const token = generateToken(userId, userType);

    // Créer un utilisateur factice pour le développement
    const user = {
      _id: userId,
      userType: email.includes('etablissement') ? 'etablissement' : 'candidat',
      email,
      phone: '+212600000000',
      isVerified: true,
      createdAt: new Date()
    };

    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Obtenir l'utilisateur actuellement connecté (simulation)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Simuler un utilisateur connecté
    const user = {
      _id: req.user.id,
      userType: req.user.userType || 'candidat',
      email: 'utilisateur@exemple.com',
      phone: '+212600000000',
      isVerified: true,
      createdAt: new Date()
    };

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations utilisateur',
      error: error.message
    });
  }
};

// @desc    Mot de passe oublié (simulation)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'En mode développement, aucun email n\'est envoyé. Utilisez directement la page de réinitialisation avec un token factice.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation du mot de passe',
      error: error.message
    });
  }
};

// @desc    Réinitialiser le mot de passe (simulation)
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un nouveau mot de passe'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès. En mode développement, aucune modification n\'est effectuée.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le mot de passe (simulation)
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir le mot de passe actuel et le nouveau mot de passe'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mot de passe mis à jour avec succès. En mode développement, aucune modification n\'est effectuée.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};
