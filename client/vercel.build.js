// Script pour aider Vercel à gérer les routes SPA
const fs = require('fs');
const path = require('path');

// Assurez-vous que le dossier build existe
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.error('Le dossier build n\'existe pas. Exécutez d\'abord npm run build.');
  process.exit(1);
}

// Créer le fichier _redirects dans le dossier build
const redirectsContent = '/* /index.html 200';
const redirectsPath = path.join(buildDir, '_redirects');
fs.writeFileSync(redirectsPath, redirectsContent);
console.log('Fichier _redirects créé avec succès dans le dossier build.');

// Vérifier si le fichier index.html existe
const indexPath = path.join(buildDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('Le fichier index.html n\'existe pas dans le dossier build.');
  process.exit(1);
}

console.log('Configuration pour Vercel terminée avec succès.');
