const Rating = require('../models/Rating');
const Application = require('../models/Application');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

/**
 * @desc    Créer une évaluation
 * @route   POST /api/ratings
 * @access  Private
 */
const createRating = async (req, res) => {
  try {
    const { applicationId, rating, comment, skills, criteria, ratingType } = req.body;

    // Vérifier que l'application existe
    const application = await Application.findById(applicationId)
      .populate({
        path: 'job',
        populate: { path: 'employer' }
      })
      .populate('candidate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }

    // Déterminer qui évalue qui
    let rater, rated;
    if (ratingType === 'candidate_to_establishment') {
      // Le candidat évalue l'établissement
      if (application.candidate._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à créer cette évaluation'
        });
      }
      rater = req.user.id;
      rated = application.job.employer._id;
    } else if (ratingType === 'establishment_to_candidate') {
      // L'établissement évalue le candidat
      if (application.job.employer._id.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à créer cette évaluation'
        });
      }
      rater = req.user.id;
      rated = application.candidate._id;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Type d\'évaluation invalide'
      });
    }

    // Vérifier si une évaluation existe déjà
    const existingRating = await Rating.findOne({
      rater,
      application: applicationId,
      ratingType
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà évalué cette candidature'
      });
    }

    // Créer l'évaluation
    const newRating = new Rating({
      rater,
      rated,
      application: applicationId,
      rating,
      comment,
      ratingType,
      skills: skills || [],
      criteria: criteria || []
    });

    await newRating.save();

    // Créer une notification pour la personne évaluée
    const raterName = req.user.userType === 'candidat' 
      ? `${req.user.candidateProfile?.firstName || ''} ${req.user.candidateProfile?.lastName || ''}`.trim() 
      : req.user.establishmentProfile?.name || 'Établissement';

    await createNotification(
      rated,
      'rating',
      `Nouvelle évaluation de ${raterName}`,
      `Vous avez reçu une évaluation de ${rating}/5 étoiles.`,
      { application: applicationId }
    );

    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'évaluation'
    });
  }
};

/**
 * @desc    Obtenir les évaluations d'un utilisateur
 * @route   GET /api/ratings/user/:userId
 * @access  Public
 */
const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Obtenir les évaluations
    const ratings = await Rating.find({ rated: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'rater',
        select: 'userType candidateProfile establishmentProfile'
      })
      .populate({
        path: 'application',
        select: 'job',
        populate: {
          path: 'job',
          select: 'title'
        }
      });

    // Calculer la note moyenne
    const averageRating = await Rating.calculateAverageRating(userId);

    res.json({
      success: true,
      count: ratings.length,
      averageRating: averageRating.average,
      totalRatings: averageRating.count,
      data: ratings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des évaluations'
    });
  }
};

/**
 * @desc    Obtenir les évaluations données par l'utilisateur connecté
 * @route   GET /api/ratings/given
 * @access  Private
 */
const getGivenRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ rater: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'rated',
        select: 'userType candidateProfile establishmentProfile'
      })
      .populate({
        path: 'application',
        select: 'job',
        populate: {
          path: 'job',
          select: 'title'
        }
      });

    res.json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations données:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des évaluations'
    });
  }
};

/**
 * @desc    Obtenir les évaluations reçues par l'utilisateur connecté
 * @route   GET /api/ratings/received
 * @access  Private
 */
const getReceivedRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ rated: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'rater',
        select: 'userType candidateProfile establishmentProfile'
      })
      .populate({
        path: 'application',
        select: 'job',
        populate: {
          path: 'job',
          select: 'title'
        }
      });

    // Calculer la note moyenne
    const averageRating = await Rating.calculateAverageRating(req.user.id);

    res.json({
      success: true,
      count: ratings.length,
      averageRating: averageRating.average,
      totalRatings: averageRating.count,
      data: ratings
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations reçues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des évaluations'
    });
  }
};

/**
 * @desc    Obtenir une évaluation par son ID
 * @route   GET /api/ratings/:id
 * @access  Public
 */
const getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate({
        path: 'rater',
        select: 'userType candidateProfile establishmentProfile'
      })
      .populate({
        path: 'rated',
        select: 'userType candidateProfile establishmentProfile'
      })
      .populate({
        path: 'application',
        select: 'job',
        populate: {
          path: 'job',
          select: 'title'
        }
      });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    res.json({
      success: true,
      data: rating
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'évaluation'
    });
  }
};

/**
 * @desc    Mettre à jour une évaluation
 * @route   PUT /api/ratings/:id
 * @access  Private
 */
const updateRating = async (req, res) => {
  try {
    const { rating, comment, skills, criteria } = req.body;

    const ratingToUpdate = await Rating.findById(req.params.id);

    if (!ratingToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'évaluation
    if (ratingToUpdate.rater.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette évaluation'
      });
    }

    // Mettre à jour l'évaluation
    ratingToUpdate.rating = rating || ratingToUpdate.rating;
    ratingToUpdate.comment = comment || ratingToUpdate.comment;
    
    if (skills && ratingToUpdate.ratingType === 'establishment_to_candidate') {
      ratingToUpdate.skills = skills;
    }
    
    if (criteria && ratingToUpdate.ratingType === 'candidate_to_establishment') {
      ratingToUpdate.criteria = criteria;
    }

    await ratingToUpdate.save();

    res.json({
      success: true,
      data: ratingToUpdate
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de l\'évaluation'
    });
  }
};

/**
 * @desc    Supprimer une évaluation
 * @route   DELETE /api/ratings/:id
 * @access  Private
 */
const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Évaluation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est l'auteur de l'évaluation
    if (rating.rater.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette évaluation'
      });
    }

    await rating.remove();

    res.json({
      success: true,
      message: 'Évaluation supprimée'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'évaluation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'évaluation'
    });
  }
};

module.exports = {
  createRating,
  getUserRatings,
  getGivenRatings,
  getReceivedRatings,
  getRatingById,
  updateRating,
  deleteRating
};
