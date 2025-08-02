const jwt = require('jsonwebtoken');

// Middleware pour protéger les routes (simulation)
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraire le token
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, veuillez vous connecter'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev_key');

    // En mode développement, on simule un utilisateur
    req.user = {
      id: decoded.id || '123456789',
      userType: decoded.userType || 'candidat',
      email: 'utilisateur@exemple.com'
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, token invalide'
    });
  }
};

// Middleware pour restreindre l'accès selon le type d'utilisateur
exports.authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Le type d'utilisateur ${req.user.userType} n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};
