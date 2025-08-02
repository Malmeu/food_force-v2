// Middleware de gestion des erreurs

// Gestionnaire d'erreur pour les erreurs 404 (ressource non trouvée)
const notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Gestionnaire d'erreur global
const errorHandler = (err, req, res, next) => {
  // Si le statut est 200 mais qu'il y a une erreur, on le change en 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
