const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    console.log('Début de la mise à jour du profil utilisateur');
    console.log('Données reçues:', JSON.stringify(req.body, null, 2));
    
    // Trouver l'utilisateur
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('Utilisateur non trouvé avec ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log('Utilisateur trouvé:', user.email, 'Type:', user.userType);

    console.log('Corps complet de la requête:', JSON.stringify(req.body, null, 2));

    // Mettre à jour les champs communs
    if (req.body.phone) {
      console.log('Mise à jour du téléphone:', req.body.phone);
      user.phone = req.body.phone;
    }
    
    if (req.body.address) {
      console.log('Mise à jour de l\'adresse');
      user.address = req.body.address;
    }

    // Traiter les champs spécifiques aux candidats
    if (user.userType === 'candidat') {
      console.log('Traitement des données du profil candidat');
      
      // Initialiser candidateProfile s'il n'existe pas encore
      if (!user.candidateProfile) {
        user.candidateProfile = {};
      }
      
      // Traiter les champs du profil candidat
      if (req.body.candidateProfile) {
        console.log('Traitement des données du profil candidat depuis candidateProfile');
        
        // Traiter chaque champ individuellement pour éviter les erreurs de validation
        if (req.body.candidateProfile.firstName) {
          user.candidateProfile.firstName = req.body.candidateProfile.firstName;
        }
        
        if (req.body.candidateProfile.lastName) {
          user.candidateProfile.lastName = req.body.candidateProfile.lastName;
        }
        
        if (req.body.candidateProfile.bio) {
          user.candidateProfile.bio = req.body.candidateProfile.bio;
        }
        
        if (req.body.candidateProfile.experienceLevel) {
          user.candidateProfile.experienceLevel = req.body.candidateProfile.experienceLevel;
        }
        
        if (req.body.candidateProfile.skills) {
          user.candidateProfile.skills = req.body.candidateProfile.skills;
        }
        
        if (req.body.candidateProfile.preferredSectors) {
          user.candidateProfile.preferredSectors = req.body.candidateProfile.preferredSectors;
        }
        
        if (req.body.candidateProfile.resume) {
          user.candidateProfile.resume = req.body.candidateProfile.resume;
        }
        
        // Traitement spécial pour le champ education qui est un tableau d'objets
        if (req.body.candidateProfile.education && Array.isArray(req.body.candidateProfile.education)) {
          console.log('Mise à jour du champ education:', req.body.candidateProfile.education);
          user.candidateProfile.education = req.body.candidateProfile.education;
        }
      }
      
      // Traiter les champs au niveau racine (pour compatibilité avec l'ancien format)
      if (req.body.firstName) user.candidateProfile.firstName = req.body.firstName;
      if (req.body.lastName) user.candidateProfile.lastName = req.body.lastName;
      if (req.body.bio) user.candidateProfile.bio = req.body.bio;
      if (req.body.experienceLevel) user.candidateProfile.experienceLevel = req.body.experienceLevel;
      if (req.body.skills) user.candidateProfile.skills = req.body.skills;
      if (req.body.preferredSectors) user.candidateProfile.preferredSectors = req.body.preferredSectors;
      if (req.body.resume) user.candidateProfile.resume = req.body.resume;
      
      // Si candidateProfile est fourni, fusionner avec les valeurs existantes
      if (req.body.candidateProfile) {
        user.candidateProfile = {
          ...user.candidateProfile,
          ...req.body.candidateProfile
        };
      }
    } 
    // Traiter les champs spécifiques aux établissements
    else if (user.userType === 'etablissement' && req.body.establishmentProfile) {
      console.log('Mise à jour du profil établissement');
      // Fusionner les objets pour ne pas écraser les champs non fournis
      user.establishmentProfile = {
        ...user.establishmentProfile,
        ...req.body.establishmentProfile
      };
      
      console.log('Profil établissement après fusion:', JSON.stringify(user.establishmentProfile, null, 2));
    }

    try {
      // Vérifier si le modèle est valide avant d'enregistrer
      const validationError = user.validateSync();
      if (validationError) {
        console.error('Erreur de validation:', validationError);
        return res.status(400).json({
          success: false,
          message: 'Erreur de validation des données',
          error: validationError.message,
          details: Object.keys(validationError.errors || {}).reduce((acc, key) => {
            acc[key] = validationError.errors[key].message;
            return acc;
          }, {})
        });
      }
      
      // Enregistrer l'utilisateur
      await user.save();
      console.log('Profil utilisateur enregistré avec succès');
      
      // Renvoyer l'utilisateur sans le mot de passe
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (saveError) {
      console.error('Erreur lors de l\'enregistrement du profil:', saveError);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enregistrement du profil',
        error: saveError.message,
        details: Object.keys(saveError.errors || {}).reduce((acc, key) => {
          acc[key] = saveError.errors[key].message;
          return acc;
        }, {})
      });
    }
  } catch (error) {
    console.error('Erreur générale lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// @desc    Obtenir le profil d'un candidat
// @route   GET /api/users/candidates/:id
// @access  Public
exports.getCandidateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user || user.userType !== 'candidat') {
      return res.status(404).json({
        success: false,
        message: 'Candidat non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil candidat',
      error: error.message
    });
  }
};

// @desc    Obtenir le profil d'un établissement
// @route   GET /api/users/establishments/:id
// @access  Public
exports.getEstablishmentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user || user.userType !== 'etablissement') {
      return res.status(404).json({
        success: false,
        message: 'Établissement non trouvé'
      });
    }

    // Récupérer également les offres d'emploi actives de l'établissement
    const jobs = await Job.find({
      employer: req.params.id,
      isActive: true
    }).select('title contractType sector location salary');

    console.log('Profil établissement récupéré:', user);
    console.log('Offres actives récupérées:', jobs);
    
    res.status(200).json({
      success: true,
      data: user,
      jobs: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil établissement',
      error: error.message
    });
  }
};

// @desc    Télécharger un CV ou une photo de profil
// @route   POST /api/users/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    console.log('Début de la fonction uploadFile');
    console.log('Fichier reçu:', req.file);
    console.log('Corps de la requête:', req.body);
    
    if (!req.file) {
      console.log('Aucun fichier n\'a été téléchargé');
      return res.status(400).json({
        success: false,
        message: 'Veuillez télécharger un fichier'
      });
    }

    const user = await User.findById(req.user.id);
    console.log('Utilisateur trouvé:', user.email);

    // Générer l'URL du fichier (dans un environnement réel, cela serait l'URL complète)
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log('URL du fichier générée:', fileUrl);

    // Déterminer le type de fichier et mettre à jour le champ approprié
    if (req.body.fileType === 'profileImage' && user.userType === 'etablissement') {
      console.log('Mise à jour de la photo de profil pour l\'établissement');
      if (!user.establishmentProfile) {
        user.establishmentProfile = {};
      }
      user.establishmentProfile.profileImage = fileUrl;
    } else if (req.body.fileType === 'logoImage' && user.userType === 'etablissement') {
      console.log('Mise à jour du logo pour l\'établissement');
      if (!user.establishmentProfile) {
        user.establishmentProfile = {};
      }
      user.establishmentProfile.logo = fileUrl;
    } else if ((req.body.fileType === 'resume' || req.body.fileType === 'cv') && user.userType === 'candidat') {
      console.log('Mise à jour du CV pour le candidat');
      if (!user.candidateProfile) {
        user.candidateProfile = {};
      }
      user.candidateProfile.resume = fileUrl;
      console.log('CV mis à jour:', fileUrl);
    } else if (req.body.fileType === 'profilePicture' && user.userType === 'candidat') {
      console.log('Mise à jour de la photo de profil pour le candidat');
      if (!user.candidateProfile) {
        user.candidateProfile = {};
      }
      user.candidateProfile.profilePicture = fileUrl;
    } else {
      console.log('Type de fichier non valide:', req.body.fileType);
      return res.status(400).json({
        success: false,
        message: 'Type de fichier non valide pour ce type d\'utilisateur'
      });
    }

    await user.save();
    console.log('Utilisateur enregistré avec succès');

    res.status(200).json({
      success: true,
      fileUrl: fileUrl,
      message: 'Fichier téléchargé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement du fichier',
      error: error.message
    });
  }
};

// @desc    Rechercher des candidats
// @route   GET /api/users/candidates/search
// @access  Private (Établissements uniquement)
exports.searchCandidates = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un établissement
    const user = await User.findById(req.user.id);
    if (user.userType !== 'etablissement') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé'
      });
    }

    // Construire la requête de recherche
    let query = { userType: 'candidat' };

    // Filtrer par compétences
    if (req.query.skills) {
      const skills = req.query.skills.split(',');
      query['candidateProfile.skills'] = { $in: skills };
    }

    // Filtrer par secteurs préférés
    if (req.query.sectors) {
      const sectors = req.query.sectors.split(',');
      query['candidateProfile.preferredSectors'] = { $in: sectors };
    }

    // Filtrer par types de contrats préférés
    if (req.query.contractTypes) {
      const contractTypes = req.query.contractTypes.split(',');
      query['candidateProfile.preferredContractTypes'] = { $in: contractTypes };
    }

    // Filtrer par ville
    if (req.query.city) {
      query['address.city'] = req.query.city;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const candidates = await User.find(query)
      .select('candidateProfile email phone address isVerified')
      .skip(startIndex)
      .limit(limit);

    const total = await User.countDocuments(query);

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
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
      count: candidates.length,
      pagination,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche de candidats',
      error: error.message
    });
  }
};

// @desc    Ajouter une évaluation à un utilisateur
// @route   POST /api/users/:id/ratings
// @access  Private
exports.addRating = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur a déjà évalué cette personne
    const alreadyRated = user.ratings.find(
      rating => rating.user.toString() === req.user.id
    );

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà évalué cet utilisateur'
      });
    }

    // Ajouter l'évaluation
    const newRating = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    user.ratings.push(newRating);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'évaluation',
      error: error.message
    });
  }
};
