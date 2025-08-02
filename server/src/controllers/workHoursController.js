const WorkHours = require('../models/WorkHours');
const Mission = require('../models/Mission');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

/**
 * @desc    Enregistrer des heures travaillu00e9es
 * @route   POST /api/workhours
 * @access  Private (Candidate)
 */
const recordWorkHours = async (req, res) => {
  try {
    const { missionId, date, hours, description } = req.body;

    // Vu00e9rifier que l'utilisateur est un candidat
    if (req.user.userType !== 'candidat') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les candidats peuvent enregistrer des heures travaillu00e9es'
      });
    }

    // Vu00e9rifier que la mission existe
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvu00e9e'
      });
    }

    // Vu00e9rifier que le candidat est bien assignu00e9 u00e0 cette mission
    if (mission.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisu00e9 u00e0 enregistrer des heures pour cette mission'
      });
    }

    // Vu00e9rifier que la date est dans la pu00e9riode de la mission
    const missionDate = new Date(date);
    const startDate = new Date(mission.startDate);
    const endDate = new Date(mission.endDate);

    if (missionDate < startDate || missionDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'La date doit u00eatre comprise dans la pu00e9riode de la mission'
      });
    }

    // Cru00e9er l'enregistrement des heures travaillu00e9es
    const workHours = new WorkHours({
      mission: missionId,
      candidate: req.user.id,
      establishment: mission.establishment,
      date: missionDate,
      hours,
      description
    });

    await workHours.save();

    // Mettre u00e0 jour les heures ru00e9elles de la mission
    const totalHours = await WorkHours.getTotalHoursForMission(missionId);
    mission.actualHours = totalHours;
    await mission.save();

    // Cru00e9er une notification pour l'u00e9tablissement
    await createNotification(
      mission.establishment,
      'workHours',
      'Nouvelles heures travaillu00e9es enregistru00e9es',
      `Le candidat a enregistru00e9 ${hours} heures pour la mission "${mission.title}"`,
      { mission: mission._id, workHours: workHours._id }
    );

    res.status(201).json({
      success: true,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement des heures travaillu00e9es'
    });
  }
};

/**
 * @desc    Obtenir les heures travaillu00e9es d'une mission
 * @route   GET /api/workhours/mission/:missionId
 * @access  Private
 */
const getMissionWorkHours = async (req, res) => {
  try {
    const { missionId } = req.params;

    // Vu00e9rifier que la mission existe
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est autorisu00e9 u00e0 voir ces heures
    if (
      mission.establishment.toString() !== req.user.id &&
      mission.candidate.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisu00e9 u00e0 voir ces heures travaillu00e9es'
      });
    }

    // Ru00e9cupu00e9rer les heures travaillu00e9es
    const workHours = await WorkHours.find({ mission: missionId })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: workHours.length,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des heures travaillu00e9es'
    });
  }
};

/**
 * @desc    Valider des heures travaillu00e9es
 * @route   PUT /api/workhours/:id/validate
 * @access  Private (Establishment)
 */
const validateWorkHours = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un u00e9tablissement
    if (req.user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les u00e9tablissements peuvent valider des heures travaillu00e9es'
      });
    }

    const workHours = await WorkHours.findById(req.params.id);

    if (!workHours) {
      return res.status(404).json({
        success: false,
        message: 'Heures travaillu00e9es non trouvu00e9es'
      });
    }

    // Vu00e9rifier que l'u00e9tablissement est bien le propriu00e9taire de la mission
    if (workHours.establishment.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisu00e9 u00e0 valider ces heures travaillu00e9es'
      });
    }

    // Valider les heures
    await workHours.validate(req.user.id);

    // Mettre u00e0 jour les heures ru00e9elles de la mission
    const mission = await Mission.findById(workHours.mission);
    const totalHours = await WorkHours.getTotalHoursForMission(workHours.mission);
    mission.actualHours = totalHours;
    await mission.save();

    // Cru00e9er une notification pour le candidat
    await createNotification(
      workHours.candidate,
      'workHours',
      'Heures travaillu00e9es validu00e9es',
      `L'u00e9tablissement a validu00e9 vos ${workHours.hours} heures pour la mission "${mission.title}"`,
      { mission: mission._id, workHours: workHours._id }
    );

    res.json({
      success: true,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors de la validation des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation des heures travaillu00e9es'
    });
  }
};

/**
 * @desc    Refuser des heures travaillu00e9es
 * @route   PUT /api/workhours/:id/reject
 * @access  Private (Establishment)
 */
const rejectWorkHours = async (req, res) => {
  try {
    const { reason } = req.body;

    // Vu00e9rifier que l'utilisateur est un u00e9tablissement
    if (req.user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les u00e9tablissements peuvent refuser des heures travaillu00e9es'
      });
    }

    const workHours = await WorkHours.findById(req.params.id);

    if (!workHours) {
      return res.status(404).json({
        success: false,
        message: 'Heures travaillu00e9es non trouvu00e9es'
      });
    }

    // Vu00e9rifier que l'u00e9tablissement est bien le propriu00e9taire de la mission
    if (workHours.establishment.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'u00eates pas autorisu00e9 u00e0 refuser ces heures travaillu00e9es'
      });
    }

    // Refuser les heures
    await workHours.reject(req.user.id, reason);

    // Ru00e9cupu00e9rer la mission pour la notification
    const mission = await Mission.findById(workHours.mission);

    // Cru00e9er une notification pour le candidat
    await createNotification(
      workHours.candidate,
      'workHours',
      'Heures travaillu00e9es refusu00e9es',
      `L'u00e9tablissement a refusu00e9 vos ${workHours.hours} heures pour la mission "${mission.title}"`,
      { mission: mission._id, workHours: workHours._id }
    );

    res.json({
      success: true,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors du refus des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du refus des heures travaillu00e9es'
    });
  }
};

/**
 * @desc    Obtenir les heures travaillu00e9es d'un candidat
 * @route   GET /api/workhours/candidate
 * @access  Private (Candidate)
 */
const getCandidateWorkHours = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un candidat
    if (req.user.userType !== 'candidat') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les candidats peuvent accu00e9der u00e0 leurs heures travaillu00e9es'
      });
    }

    const workHours = await WorkHours.find({ candidate: req.user.id })
      .populate({
        path: 'mission',
        select: 'title establishment',
        populate: {
          path: 'establishment',
          select: 'establishmentProfile.name'
        }
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: workHours.length,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des heures travaillu00e9es'
    });
  }
};

/**
 * @desc    Obtenir les heures travaillu00e9es pour un u00e9tablissement
 * @route   GET /api/workhours/establishment
 * @access  Private (Establishment)
 */
const getEstablishmentWorkHours = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un u00e9tablissement
    if (req.user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les u00e9tablissements peuvent accu00e9der u00e0 leurs heures travaillu00e9es'
      });
    }

    const workHours = await WorkHours.find({ establishment: req.user.id })
      .populate({
        path: 'mission',
        select: 'title'
      })
      .populate({
        path: 'candidate',
        select: 'candidateProfile.firstName candidateProfile.lastName'
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: workHours.length,
      data: workHours
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des heures travaillu00e9es:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des heures travaillu00e9es'
    });
  }
};

module.exports = {
  recordWorkHours,
  getMissionWorkHours,
  validateWorkHours,
  rejectWorkHours,
  getCandidateWorkHours,
  getEstablishmentWorkHours
};
