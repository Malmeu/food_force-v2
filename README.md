# FoodForce Maroc

Une plateforme de mise en relation entre candidats et établissements dans les secteurs de la restauration, hôtellerie, événementiel, vente et logistique au Maroc.

## Présentation du Projet

FoodForce Maroc est une plateforme inspirée d'Extracadabra, adaptée au marché marocain. Elle permet de connecter les professionnels des secteurs de la restauration, hôtellerie, événementiel, vente et logistique avec des établissements à la recherche de personnel qualifié.

## Fonctionnalités Principales

1. **Inscription et Profil**
   - Création de comptes pour candidats et établissements
   - Validation des comptes par e-mail
   - Profils détaillés avec compétences, expériences et préférences

2. **Publication d'Offres d'Emploi**
   - Types de contrats: CDI, CDD, Intérim, Extra
   - Détails des offres avec description, compétences, horaires, rémunération
   - Géolocalisation des offres

3. **Recherche et Candidatures**
   - Filtres de recherche avancés par secteur, type de contrat, localisation
   - Système de matching intelligent
   - Processus de candidature simplifié

4. **Gestion des Missions**
   - Validation des heures travaillées par les deux parties
   - Suivi des missions en cours
   - Paiement par virement bancaire

5. **Évaluations et Avis**
   - Système d'évaluation mutuelle entre candidats et établissements
   - Témoignages et retours d'expérience

6. **Sécurité et Conformité RGPD**
   - Protection des données personnelles
   - Sécurisation des transactions

## Technologies Utilisées

### Backend
- **Node.js** avec **Express** pour l'API RESTful
- **MongoDB** pour la base de données
- **JWT** pour l'authentification
- **Nodemailer** pour l'envoi d'emails

### Frontend
- **React** pour l'interface utilisateur
- **Material-UI** pour les composants d'interface
- **React Router** pour la navigation
- **Axios** pour les requêtes HTTP
- **Formik** et **Yup** pour la gestion des formulaires et validations

## Structure du Projet

```
/
├── client/                 # Frontend React
│   ├── public/             # Fichiers statiques
│   └── src/                # Code source React
│       ├── components/     # Composants réutilisables
│       ├── context/        # Contextes React (Auth, etc.)
│       ├── pages/          # Pages de l'application
│       └── utils/          # Utilitaires et helpers
│
├── server/                 # Backend Node.js/Express
│   ├── src/                # Code source du serveur
│   │   ├── controllers/    # Contrôleurs de l'API
│   │   ├── models/         # Modèles Mongoose
│   │   ├── routes/         # Routes de l'API
│   │   ├── middleware/     # Middlewares Express
│   │   ├── utils/          # Utilitaires
│   │   └── config/         # Configuration
│   └── .env.example        # Exemple de variables d'environnement
│
└── docs/                   # Documentation du projet
```

## Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (local ou distant)
- npm ou yarn

### Étapes d'installation

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]
cd food_force

# Installer les dépendances du backend
cd server
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos propres valeurs

# Installer les dépendances du frontend
cd ../client
npm install
```

## Démarrage

```bash
# Démarrer le backend (depuis le dossier server)
cd server
npm run dev

# Démarrer le frontend (depuis le dossier client)
cd ../client
npm start
```

L'application sera accessible à l'adresse http://localhost:3000 et l'API à l'adresse http://localhost:5000.

## Déploiement

### Backend
Le backend peut être déployé sur des plateformes comme Heroku, Digital Ocean, AWS, etc.

### Frontend
Le frontend peut être déployé sur Netlify, Vercel, GitHub Pages, etc.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT.

