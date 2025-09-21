const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

// Routes
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const authRoutes = require('./routes/auth');
const notificationRoutes = require('./routes/notifications');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const ratingRoutes = require('./routes/ratings');
const missionRoutes = require('./routes/missions');
const workHoursRoutes = require('./routes/workHours');

// Configuration des variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connectDB();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS d'urgence - Très permissive pour diagnostiquer
const corsOptions = {
  origin: true, // Autorise toutes les origines temporairement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Middlewares
app.use(cors(corsOptions));

// Middleware CORS manuel en backup
app.use((req, res, next) => {
  console.log(`CORS Debug: ${req.method} ${req.url} from ${req.headers.origin}`);
  
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling preflight request');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour logger les requêtes (débogage)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Dossier des uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes API
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/workhours', workHoursRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API FoodForce Maroc');
});

// Route de test CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS fonctionne !', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'POST CORS fonctionne !', 
    origin: req.headers.origin,
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur avec connexion à la base de données
console.log(`Démarrage du serveur en mode ${process.env.NODE_ENV || 'development'}`);
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
