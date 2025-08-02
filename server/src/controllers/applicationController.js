const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Postuler u00e0 une offre d'emploi
// @route   POST /api/applications
// @access  Private (Candidats uniquement)
exports.applyForJob = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un candidat
    const user = await User.findById(req.user.id);
    if (user.userType !== 'candidat') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les candidats peuvent postuler aux offres d\'emploi'
      });
    }

    // Vu00e9rifier que l'offre existe
    const job = await Job.findById(req.body.job);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvu00e9e'
      });
    }

    // Vu00e9rifier si le candidat a du00e9ju00e0 postulu00e9 u00e0 cette offre
    const existingApplication = await Application.findOne({
      job: req.body.job,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez du00e9ju00e0 postulu00e9 u00e0 cette offre d\'emploi'
      });
    }

    // Cru00e9er la candidature
    const application = await Application.create({
      job: req.body.job,
      candidate: req.user.id,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la candidature',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les candidatures pour un employeur
// @route   GET /api/applications/employer
// @access  Private (Employeurs uniquement)
exports.getEmployerApplications = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un u00e9tablissement
    const user = await User.findById(req.user.id);
    if (user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Trouver toutes les offres d'emploi de l'employeur
    const jobs = await Job.find({ employer: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Trouver toutes les candidatures pour ces offres
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate({
        path: 'candidate',
        select: 'candidateProfile.firstName candidateProfile.lastName candidateProfile.profilePicture'
      })
      .populate('job', 'title contractType');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la ru00e9cupu00e9ration des candidatures',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les candidatures d'un candidat
// @route   GET /api/applications/candidate
// @access  Private (Candidats uniquement)
exports.getCandidateApplications = async (req, res) => {
  try {
    // Vu00e9rifier que l'utilisateur est un candidat
    const user = await User.findById(req.user.id);
    if (user.userType !== 'candidat') {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Trouver toutes les candidatures du candidat
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title contractType salary location.city',
        populate: {
          path: 'employer',
          select: 'establishmentProfile.name establishmentProfile.logo'
        }
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la ru00e9cupu00e9ration des candidatures',
      error: error.message
    });
  }
};

// @desc    Obtenir une candidature spu00e9cifique
// @route   GET /api/applications/:id
// @access  Private (Propriu00e9taire de la candidature ou de l'offre)
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'candidate',
        select: 'candidateProfile email phone'
      })
      .populate({
        path: 'job',
        select: 'title description contractType salary location workingHours',
        populate: {
          path: 'employer',
          select: 'establishmentProfile.name establishmentProfile.logo establishmentProfile.contactPerson'
        }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est le candidat ou l'employeur
    const job = await Job.findById(application.job);
    if (
      application.candidate._id.toString() !== req.user.id &&
      job.employer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la ru00e9cupu00e9ration de la candidature',
      error: error.message
    });
  }
};

// @desc    Mettre u00e0 jour le statut d'une candidature
// @route   PUT /api/applications/:id/status
// @access  Private (Employeurs uniquement)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'employeur
    const job = await Job.findById(application.job);
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Mettre u00e0 jour le statut
    console.log('Données reçues pour la mise à jour du statut:', req.body);
    
    // Vérifier le format des données reçues
    if (req.body.status) {
      application.status = req.body.status;
    } else if (typeof req.body === 'object' && 'status' in req.body) {
      application.status = req.body.status;
    } else {
      // Essayer de parser le corps de la requête si c'est une chaîne JSON
      try {
        const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        application.status = parsedBody.status;
      } catch (parseError) {
        console.error('Erreur lors du parsing du corps de la requête:', parseError);
        return res.status(400).json({
          success: false,
          message: 'Format de données invalide pour la mise à jour du statut',
          error: parseError.message
        });
      }
    }
    
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise u00e0 jour du statut de la candidature',
      error: error.message
    });
  }
};

// @desc    Enregistrer les heures travaillu00e9es
// @route   POST /api/applications/:id/hours
// @access  Private (Employeurs uniquement)
exports.recordHoursWorked = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'employeur
    const job = await Job.findById(application.job);
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Ajouter les heures travaillu00e9es
    application.mission.hoursWorked.push({
      date: req.body.date,
      hours: req.body.hours,
      validated: {
        byEmployer: true,
        byCandidate: false
      }
    });

    // Mettre u00e0 jour le total des heures
    application.mission.totalHours += req.body.hours;

    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement des heures travaillu00e9es',
      error: error.message
    });
  }
};

// @desc    Valider les heures travaillu00e9es (par le candidat)
// @route   PUT /api/applications/:id/hours/:hourId/validate
// @access  Private (Candidats uniquement)
exports.validateHoursWorked = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est le candidat
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Trouver et mettre u00e0 jour l'enregistrement des heures
    const hourRecord = application.mission.hoursWorked.id(req.params.hourId);
    if (!hourRecord) {
      return res.status(404).json({
        success: false,
        message: 'Enregistrement des heures non trouvu00e9'
      });
    }

    hourRecord.validated.byCandidate = true;
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la validation des heures travaillu00e9es',
      error: error.message
    });
  }
};

// @desc    Soumettre un avis sur un candidat
// @route   POST /api/applications/:id/feedback/employer
// @access  Private (Employeurs uniquement)
exports.submitEmployerFeedback = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est l'employeur
    const job = await Job.findById(application.job);
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Ajouter l'avis
    application.feedback.fromEmployer = {
      rating: req.body.rating,
      comment: req.body.comment,
      date: Date.now()
    };

    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de l\'avis',
      error: error.message
    });
  }
};

// @desc    Soumettre un avis sur un employeur
// @route   POST /api/applications/:id/feedback/candidate
// @access  Private (Candidats uniquement)
exports.submitCandidateFeedback = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est le candidat
    if (application.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Accu00e8s non autorisu00e9'
      });
    }

    // Ajouter l'avis
    application.feedback.fromCandidate = {
      rating: req.body.rating,
      comment: req.body.comment,
      date: Date.now()
    };

    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission de l\'avis',
      error: error.message
    });
  }
};
