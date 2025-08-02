const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Déterminer le dossier de destination en fonction du type de fichier
    let uploadDir = 'uploads/';
    
    if (req.body.fileType === 'resume') {
      uploadDir += 'resumes/';
    } else if (req.body.fileType === 'profilePicture') {
      uploadDir += 'profiles/';
    } else if (req.body.fileType === 'logo') {
      uploadDir += 'logos/';
    } else {
      uploadDir += 'others/';
    }
    
    // Créer le dossier s'il n'existe pas
    const fullPath = path.join(__dirname, '../../', uploadDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  // Types MIME autorisés
  const allowedMimeTypes = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
  };
  
  if (allowedMimeTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non pris en charge. Formats autorisés : JPEG, PNG, GIF, PDF, DOC, DOCX'), false);
  }
};

// Limites pour les uploads
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB
  files: 1 // Un seul fichier à la fois
};

// Configuration de Multer
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = upload;
