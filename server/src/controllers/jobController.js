const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const mongoose = require('mongoose');

// @desc    Créer une nouvelle offre d'emploi
// @route   POST /api/jobs
// @access  Private (Établissements uniquement)
exports.createJob = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un établissement
    const user = await User.findById(req.user.id);
    if (user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les établissements peuvent créer des offres d\'emploi'
      });
    }

    // Ajouter l'ID de l'employeur à l'offre
    req.body.employer = req.user.id;

    console.log('Données reçues pour création d\'offre:', JSON.stringify(req.body, null, 2));

    // Préparer les données de base pour l'offre d'emploi
    const jobData = {
      // Champs obligatoires avec valeurs par défaut si non fournies
      title: req.body.title || 'Offre d\'emploi',
      description: req.body.description || 'Description de l\'offre',
      contractType: req.body.contractType || 'CDI',
      sector: req.body.sector || 'Restauration',
      experienceLevel: req.body.experienceLevel || 'Débutant',
      startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
      employer: req.user.id,
      isActive: true,
      status: req.body.status || 'active',
      
      // Champs optionnels avec valeurs par défaut
      applicationDeadline: req.body.applicationDeadline ? 
        new Date(req.body.applicationDeadline) : 
        new Date(new Date().setMonth(new Date().getMonth() + 1)),
      workingDays: req.body.workingDays || ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    };

    // Gérer l'objet location
    jobData.location = {
      city: req.body.location?.city || 
            (typeof req.body.location === 'string' ? req.body.location : 'Casablanca'),
      address: req.body.location?.address || ''
    };

    // Gérer l'objet salary
    jobData.salary = {
      amount: req.body.salary?.amount || 
              (typeof req.body.salary === 'number' ? req.body.salary : 5000),
      period: req.body.salary?.period || 'Mois',
      currency: req.body.salary?.currency || 'MAD'
    };

    // Gérer les compétences requises (requiredSkills ou skills)
    if (req.body.requiredSkills || req.body.skills) {
      const skillsData = req.body.requiredSkills || req.body.skills;
      
      if (Array.isArray(skillsData)) {
        jobData.requiredSkills = skillsData;
      } else if (typeof skillsData === 'string') {
        jobData.requiredSkills = skillsData.split(',').map(skill => skill.trim());
      } else {
        jobData.requiredSkills = ['Service client'];
      }
    } else {
      jobData.requiredSkills = ['Service client'];
    }

    // Gérer les heures de travail si fournies
    if (req.body.workingHours) {
      jobData.workingHours = req.body.workingHours;
    } else {
      jobData.workingHours = {
        start: '09:00',
        end: '18:00'
      };
    }

    console.log('Données formatées pour création d\'offre:', JSON.stringify(jobData, null, 2));
    
    // Créer l'offre d'emploi dans la base de données
    const job = await Job.create(jobData);
    
    // Renvoyer une réponse de succès avec les données de l'offre créée
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    
    // Renvoyer une réponse d'erreur détaillée
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre d\'emploi',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les offres d'emploi
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    // Construire la requête
    let query;

    // Copier req.query
    const reqQuery = { ...req.query };

    // Champs à exclure
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Supprimer les champs à exclure de reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Créer la chaîne de requête
    let queryStr = JSON.stringify(reqQuery);

    // Créer les opérateurs ($gt, $gte, etc.)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Trouver les offres d'emploi actives uniquement
    const parsedQuery = JSON.parse(queryStr);
    
    // Ne filtrer par statut que si spécifiquement demandé
    // Si status=all, afficher toutes les offres
    if (req.query.status === 'all') {
      delete parsedQuery.status;
      console.log('Affichage de toutes les offres sans filtre de statut');
    } else if (!parsedQuery.status) {
      // Par défaut, afficher uniquement les offres actives
      parsedQuery.status = 'active';
      console.log('Filtre par défaut: affichage des offres actives uniquement');
    } else {
      console.log(`Filtre de statut spécifié: ${parsedQuery.status}`);
    }
    
    query = Job.find(parsedQuery).populate({
      path: 'employer',
      select: 'establishmentProfile.name establishmentProfile.logo'
    });

    // Sélection des champs
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Tri
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Exécuter la requête
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres d\'emploi',
      error: error.message
    });
  }
};

// @desc    Obtenir une offre d'emploi spécifique
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'employer',
      select: 'establishmentProfile.name establishmentProfile.logo establishmentProfile.description'
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'offre d\'emploi',
      error: error.message
    });
  }
};

// @desc    Mettre à jour une offre d'emploi
// @route   PUT /api/jobs/:id
// @access  Private (Propriétaire de l'offre uniquement)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de l'offre
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette offre d\'emploi'
      });
    }

    // Mettre à jour l'offre
    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'offre d\'emploi',
      error: error.message
    });
  }
};

// @desc    Supprimer une offre d'emploi
// @route   DELETE /api/jobs/:id
// @access  Private (Propriétaire de l'offre uniquement)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de l'offre
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette offre d\'emploi'
      });
    }

    // Utiliser deleteOne au lieu de remove() qui est déprécié dans les versions récentes de Mongoose
    await Job.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'offre d\'emploi',
      error: error.message
    });
  }
};

// @desc    Rechercher des offres d'emploi par géolocalisation
// @route   GET /api/jobs/radius/:zipcode/:distance
// @access  Public
exports.getJobsInRadius = async (req, res) => {
  try {
    const { city, distance } = req.params;

    // Rechercher les offres d'emploi par ville
    const jobs = await Job.find({
      location: { $regex: city, $options: 'i' }
    }).populate({
      path: 'employer',
      select: 'establishmentName city'
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche des offres d\'emploi',
      error: error.message
    });
  }
};

// @desc    Obtenir les offres d'emploi d'un employeur
// @route   GET /api/jobs/employer
// @access  Private (Établissements uniquement)
exports.getEmployerJobs = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un établissement
    const user = await User.findById(req.user.id);
    if (user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les établissements peuvent accéder à leurs offres d\'emploi'
      });
    }

    // Rechercher les offres d'emploi de l'employeur
    const jobs = await Job.find({ employer: req.user.id })
      .sort({ createdAt: -1 });

    // Pour chaque offre, compter le nombre de candidatures
    const jobsWithApplicationsCount = await Promise.all(jobs.map(async (job) => {
      const jobObj = job.toObject();
      
      // Compter les candidatures pour cette offre
      const applicationsCount = await Application.countDocuments({ job: job._id });
      
      return {
        ...jobObj,
        applicationsCount
      };
    }));

    res.status(200).json({
      success: true,
      count: jobsWithApplicationsCount.length,
      data: jobsWithApplicationsCount
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres d\'emploi',
      error: error.message
    });
  }
};
