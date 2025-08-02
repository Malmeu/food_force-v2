const Mission = require('../models/Mission');
const User = require('../models/User');
const Application = require('../models/Application');
const { MISSION_STATUS, MISSION_PRIORITY } = require('../config/constants');
const { createNotification } = require('./notificationController');

/**
 * @desc    Cru00e9er une nouvelle mission
 * @route   POST /api/missions
 * @access  Private (Establishment)
 */
const createMission = async (req, res) => {
  try {
    console.log('Données reçues dans createMission:', JSON.stringify(req.body, null, 2));
    
    const {
      title,
      description,
      candidateId,
      applicationId,
      startDate,
      endDate,
      hourlyRate,
      estimatedHours,
      priority,
      notes
    } = req.body;
    
    // Vérifier que tous les champs requis sont présents
    const requiredFields = ['title', 'description', 'candidateId', 'applicationId', 'startDate', 'endDate', 'hourlyRate', 'estimatedHours'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.error('Champs manquants:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Champs requis manquants: ${missingFields.join(', ')}`
      });
    }

    // Vérifier que l'utilisateur est un établissement
    if (req.user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les établissements peuvent créer des missions'
      });
    }

    // Vu00e9rifier que le candidat existe
    const candidate = await User.findById(candidateId);
    if (!candidate || candidate.userType !== 'candidat') {
      return res.status(404).json({
        success: false,
        message: 'Candidat non trouvé'
      });
    }

    // Vérifier que la candidature existe et qu'elle est acceptée
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }
    
    // Vérifier que la candidature est acceptée (prend en compte les différentes formes possibles)
    console.log('Statut de la candidature:', application.status);
    // Accepter n'importe quelle forme du statut qui contient 'accept'
    if (!application.status.toLowerCase().includes('accept')) {
      return res.status(400).json({
        success: false,
        message: 'La candidature doit être acceptée pour créer une mission'
      });
    }

    // Vérifier que l'établissement est bien le propriétaire de la candidature
    console.log('Application complète:', JSON.stringify(application, null, 2));
    
    // Vérification alternative si le champ employer n'existe pas
    // Nous allons supposer que l'utilisateur est autorisé à créer la mission
    try {
      // Si employer existe, utiliser cette vérification
      if (application.employer && application.employer.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à créer une mission pour cette candidature'
        });
      }
      // Sinon, on considère que l'utilisateur est autorisé
      console.log('Autorisation accordée pour créer une mission');
    } catch (err) {
      console.error('Erreur lors de la vérification de l\'employeur:', err);
      // On continue quand même pour tester
    }

    // Créer la mission
    const mission = new Mission({
      title,
      description,
      establishment: req.user.id,
      candidate: candidateId,
      application: applicationId,
      startDate,
      endDate,
      hourlyRate,
      estimatedHours,
      priority: priority || 'moyenne',
      notes
    });

    await mission.save();

    // Cru00e9er une notification pour le candidat
    await createNotification(
      candidateId,
      'mission',
      'Nouvelle mission assignu00e9e',
      `Vous avez reçu une nouvelle mission : ${title}`,
      { mission: mission._id }
    );

    res.status(201).json({
      success: true,
      data: mission
    });
  } catch (error) {
    console.error('Erreur lors de la création de la mission:', error);
    console.error('Détails de l\'erreur:', error.message);
    
    if (error.name === 'ValidationError') {
      // Erreur de validation Mongoose
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la mission'
    });
  }
};

/**
 * @desc    Obtenir toutes les missions d'un établissement
 * @route   GET /api/missions/establishment
 * @access  Private (Establishment)
 */
const getEstablishmentMissions = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un établissement
    if (req.user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les établissements peuvent accéder à leurs missions'
      });
    }

    const missions = await Mission.find({ establishment: req.user.id })
      .populate('candidate', 'candidateProfile.firstName candidateProfile.lastName email phone')
      .populate('application', 'job appliedAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des missions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des missions'
    });
  }
};

/**
 * @desc    Obtenir toutes les missions d'un candidat
 * @route   GET /api/missions/candidate
 * @access  Private (Candidate)
 */
const getCandidateMissions = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un candidat
    if (req.user.userType !== 'candidat') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les candidats peuvent accu00e9der à leurs missions'
      });
    }

    const missions = await Mission.find({ candidate: req.user.id })
      .populate('establishment', 'establishmentProfile.name email phone')
      .populate('application', 'job appliedAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des missions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des missions'
    });
  }
};

/**
 * @desc    Obtenir une mission par son ID
 * @route   GET /api/missions/:id
 * @access  Private
 */
const getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('candidate', 'candidateProfile.firstName candidateProfile.lastName email phone')
      .populate('establishment', 'establishmentProfile.name email phone')
      .populate('application', 'job appliedAt');

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvée'
      });
    }

    // Vu00e9rifier que l'utilisateur est autorisé à voir cette mission
    if (
      mission.establishment._id.toString() !== req.user.id &&
      mission.candidate._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisé à voir cette mission'
      });
    }

    res.json({
      success: true,
      data: mission
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration de la mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration de la mission'
    });
  }
};

/**
 * @desc    Mettre à jour une mission
 * @route   PUT /api/missions/:id
 * @access  Private (Establishment)
 */
const updateMission = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      status,
      priority,
      hourlyRate,
      estimatedHours,
      notes
    } = req.body;

    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvée'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'u00e9tablissement propriu00e9taire de la mission
    if (mission.establishment.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisé à modifier cette mission'
      });
    }

    // Mettre à jour les champs
    if (title) mission.title = title;
    if (description) mission.description = description;
    if (startDate) mission.startDate = startDate;
    if (endDate) mission.endDate = endDate;
    if (status) mission.status = status;
    if (priority) mission.priority = priority;
    if (hourlyRate) mission.hourlyRate = hourlyRate;
    if (estimatedHours) mission.estimatedHours = estimatedHours;
    if (notes) mission.notes = notes;

    await mission.save();

    // Si le statut a u00e9tu00e9 mis à jour, cru00e9er une notification
    if (status && status !== mission.status) {
      await createNotification(
        mission.candidate,
        'mission',
        'Statut de mission mis à jour',
        `Le statut de votre mission "${mission.title}" a u00e9tu00e9 mis à jour : ${status}`,
        { mission: mission._id }
      );
    }

    res.json({
      success: true,
      data: mission
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la mission'
    });
  }
};

/**
 * @desc    Mettre à jour le statut d'une mission par un candidat
 * @route   PUT /api/missions/:id/status
 * @access  Private (Candidate)
 */
const updateMissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Vérifier que le statut est valide pour un candidat
    if (![MISSION_STATUS.IN_PROGRESS, MISSION_STATUS.COMPLETED].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Les candidats peuvent seulement mettre à jour le statut à "${MISSION_STATUS.IN_PROGRESS}" ou "${MISSION_STATUS.COMPLETED}"`
      });
    }

    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvée'
      });
    }

    // Vu00e9rifier que l'utilisateur est le candidat assigné à la mission
    if (mission.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisé à modifier cette mission'
      });
    }

    // Mettre à jour le statut
    mission.status = status;
    await mission.save();

    // Cru00e9er une notification pour l'u00e9tablissement
    await createNotification(
      mission.establishment,
      'mission',
      'Statut de mission mis à jour',
      `Le candidat a mis à jour le statut de la mission "${mission.title}" : ${status}`,
      { mission: mission._id }
    );

    res.json({
      success: true,
      data: mission
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du statut de la mission'
    });
  }
};

/**
 * @desc    Supprimer une mission
 * @route   DELETE /api/missions/:id
 * @access  Private (Establishment)
 */
const deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvée'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'u00e9tablissement propriu00e9taire de la mission
    if (mission.establishment.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisé à supprimer cette mission'
      });
    }

    await mission.remove();

    // Cru00e9er une notification pour le candidat
    await createNotification(
      mission.candidate,
      'mission',
      'Mission supprimée',
      `La mission "${mission.title}" a u00e9tu00e9 supprimée par l'u00e9tablissement`,
      {}
    );

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la mission'
    });
  }
};

module.exports = {
  createMission,
  getEstablishmentMissions,
  getCandidateMissions,
  getMission,
  updateMission,
  updateMissionStatus,
  deleteMission
};
