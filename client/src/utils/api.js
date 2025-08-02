import axios from 'axios';

// Déterminer la baseURL en fonction de l'environnement
const isProduction = process.env.NODE_ENV === 'production';

// En production, utiliser l'URL complète de l'API
// En développement, utiliser le proxy configuré dans package.json
const API_BASE_URL = isProduction 
  ? 'https://food-force-api.onrender.com/api'
  : '/api';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  },
  timeout: 15000, // 15 secondes de timeout pour donner plus de temps aux requêtes
  withCredentials: false // Désactiver l'envoi des cookies pour éviter les problèmes CORS
});

// Log pour le débogage
console.log(`API configurée avec baseURL: ${API_BASE_URL} (${isProduction ? 'production' : 'développement'})`);

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Nous n'ajoutons pas d'en-têtes supplémentaires pour éviter les problèmes CORS
    // Les en-têtes de cache sont déjà définis dans la configuration de base
    
    // Ajouter un timestamp pour éviter la mise en cache
    if (config.method && config.method.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    // Log de débogage pour les réponses réussies
    console.log(`Réponse API réussie [${response.config.url}]:`, response.status);
    return response;
  },
  (error) => {
    // Gestion détaillée des erreurs pour faciliter le débogage
    if (error.name === 'AbortError' || error.name === 'CanceledError' || error.message === 'canceled') {
      console.warn('Requête annulée - Probablement par timeout ou changement de page');
    } else if (error.response) {
      // La requête a été effectuée et le serveur a répondu avec un code d'état hors de la plage 2xx
      console.error(`Erreur API [${error.config?.url}] - Statut:`, error.response.status);
      console.error('Données d\'erreur:', error.response.data);
    } else if (error.request) {
      // La requête a été effectuée mais aucune réponse n'a été reçue
      console.error(`Erreur API [${error.config?.url}] - Pas de réponse:`, error.request);
      console.error('Vérifiez que le serveur backend est bien en cours d\'exécution sur le port 5001');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error(`Erreur API [${error.config?.url}] - Configuration:`, error.message);
      return Promise.reject({
        ...error,
        isAbortError: true,
        message: 'Requête annulée. Utilisation des données en cache si disponibles.'
      });
    }
    
    // Gérer les erreurs de réseau
    if (error.message === 'Network Error') {
      console.warn('Erreur réseau - Problème de connexion au serveur');
      return Promise.reject({
        ...error,
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet ou réessayez plus tard.'
      });
    }
    
    // Gérer les erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      console.warn('Timeout - Le serveur met trop de temps à répondre');
      return Promise.reject({
        ...error,
        message: 'Le serveur met trop de temps à répondre. Veuillez réessayer plus tard.'
      });
    }
    
    // Pour les autres erreurs, renvoyer l'erreur
    return Promise.reject(error);
  }
);

// Fonctions API pour l'authentification
export const authAPI = {
  register(userData) {
    return api.post('/auth/register', userData);
  },
  login(email, password) {
    return api.post('/auth/login', { email, password });
  },
  getCurrentUser(config) {
    return api.get('/auth/me', config);
  },
  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },
  resetPassword(token, password) {
    return api.put(`/auth/reset-password/${token}`, { password });
  },
  updatePassword(passwordData) {
    return api.put('/auth/update-password', passwordData);
  }
};

// Fonctions API pour les utilisateurs
export const usersAPI = {
  updateProfile(userData) {
    return api.put('/users/profile', userData);
  },
  uploadAvatar(formData) {
    return api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadCV(formData) {
    return api.post('/users/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  uploadFile(formData) {
    // Fonction générique pour télécharger n'importe quel type de fichier
    return api.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getProfile(userId) {
    return api.get(`/users/${userId}`);
  },
  getCandidates(filters) {
    return api.get('/users/candidates', { params: filters });
  },
  getEstablishments(filters) {
    return api.get('/users/establishments', { params: filters });
  }
};

// Fonctions API pour les offres d'emploi
export const jobsAPI = {
  async getJobs(filters) {
    console.log('Appel API getJobs avec filtres:', filters);
    
    // Déterminer si nous sommes en production
    const isProduction = process.env.NODE_ENV === 'production';
    
    try {
      // Construire l'URL avec les paramètres
      let url;
      
      if (isProduction) {
        // En production, utiliser l'URL complète de l'API Render
        url = new URL('/api/jobs', 'https://food-force-api.onrender.com');
      } else {
        // En développement, utiliser le proxy React
        url = new URL('/api/jobs', window.location.origin);
      }
      
      // Ajouter explicitement status=all pour récupérer toutes les offres
      url.searchParams.append('status', 'all');
      
      // Ajouter les filtres comme paramètres d'URL
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
            url.searchParams.append(key, filters[key]);
          }
        });
      }
      
      console.log('URL de requête complète:', url.toString());
      
      // Effectuer la requête fetch
      const fetchResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!fetchResponse.ok) {
        throw new Error(`Erreur HTTP: ${fetchResponse.status}`);
      }
      
      const data = await fetchResponse.json();
      console.log('Réponse fetch API getJobs:', data);
      
      // Formater la réponse pour être compatible avec le format axios
      return {
        data: data,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers
      };
    } catch (error) {
      console.error('Erreur API getJobs (fetch):', error);
      throw error;
    }
  },
  async getJob(jobId) {
    console.log('Appel API getJob avec ID:', jobId);
    
    // Déterminer si nous sommes en production
    const isProduction = process.env.NODE_ENV === 'production';
    
    try {
      // Construire l'URL avec les paramètres
      let url;
      
      if (isProduction) {
        // En production, utiliser l'URL complète de l'API Render
        url = new URL(`/api/jobs/${jobId}`, 'https://food-force-api.onrender.com');
      } else {
        // En développement, utiliser le proxy React
        url = new URL(`/api/jobs/${jobId}`, window.location.origin);
      }
      
      console.log('URL de requête complète:', url.toString());
      
      // Effectuer la requête fetch
      const fetchResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!fetchResponse.ok) {
        throw new Error(`Erreur HTTP: ${fetchResponse.status}`);
      }
      
      const data = await fetchResponse.json();
      console.log('Réponse fetch API getJob:', data);
      
      // Formater la réponse pour être compatible avec le format axios
      return {
        data: data,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers
      };
    } catch (error) {
      console.error('Erreur API getJob (fetch):', error);
      throw error;
    }
  },
  createJob(jobData) {
    return api.post('/jobs', jobData);
  },
  updateJob(jobId, jobData) {
    return api.put(`/jobs/${jobId}`, jobData);
  },
  deleteJob(jobId) {
    return api.delete(`/jobs/${jobId}`);
  },
  getEstablishmentJobs(establishmentId) {
    return api.get(`/jobs/establishment/${establishmentId}`);
  },
  // Ajout de la fonction manquante
  getEmployerJobs() {
    return api.get('/jobs/employer');
  }
};

// Fonctions API pour les candidatures
export const applicationsAPI = {
  apply(jobId, applicationData) {
    return api.post(`/applications/job/${jobId}`, applicationData);
  },
  getApplications(filters) {
    return api.get('/applications', { params: filters });
  },
  getApplication(applicationId) {
    return api.get(`/applications/${applicationId}`);
  },
  updateApplicationStatus(applicationId, status) {
    return api.put(`/applications/${applicationId}/status`, { status });
  },
  getCandidateApplications() {
    return api.get('/applications/candidate');
  },
  getJobApplications(jobId) {
    return api.get(`/applications/job/${jobId}`);
  },
  // Ajout de la fonction manquante
  getEmployerApplications() {
    return api.get('/applications/employer');
  }
};

// Fonctions API pour les messages - DÉSACTIVÉ
export const messagesAPI = {
  // API de messagerie désactivée
  sendMessage() {
    console.warn('La messagerie a été désactivée');
    return Promise.resolve({ success: false, message: 'La messagerie a été désactivée' });
  },
  getConversations() {
    console.warn('La messagerie a été désactivée');
    return Promise.resolve({ success: false, message: 'La messagerie a été désactivée', data: [] });
  },
  getMessages() {
    console.warn('La messagerie a été désactivée');
    return Promise.resolve({ success: false, message: 'La messagerie a été désactivée', data: [] });
  },
  markAsRead() {
    console.warn('La messagerie a été désactivée');
    return Promise.resolve({ success: false, message: 'La messagerie a été désactivée' });
  },
  async getUnreadCount() {
    console.warn('La messagerie a été désactivée');
    return { count: 0 };
  }
};

// Fonctions API pour les notifications
export const notificationsAPI = {
  getNotifications() {
    return api.get('/notifications');
  },
  async getAll() {
    try {
      // Déterminer l'URL en fonction de l'environnement
      const isProduction = process.env.NODE_ENV === 'production';
      let baseUrl;
      if (isProduction) {
        baseUrl = 'https://food-force-api.onrender.com';
      } else {
        baseUrl = window.location.origin;
      }
      
      const url = new URL('/api/notifications', baseUrl);
      console.log('URL de récupération des notifications:', url.toString());
      
      // Ajouter le token d'authentification
      const token = localStorage.getItem('token');
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Effectuer la requête avec fetch
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Réponse notifications:', data);
      
      return data;
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
      throw err;
    }
  },
  markAsRead(notificationId) {
    return api.put(`/notifications/${notificationId}/read`);
  },
  markAllAsRead() {
    return api.put('/notifications/read-all');
  },
  async getUnreadCount() {
    try {
      // Déterminer l'URL en fonction de l'environnement
      const isProduction = process.env.NODE_ENV === 'production';
      let baseUrl;
      if (isProduction) {
        baseUrl = 'https://food-force-api.onrender.com';
      } else {
        baseUrl = window.location.origin;
      }
      
      const url = new URL('/api/notifications/unread/count', baseUrl);
      console.log('URL de récupération des notifications non lues:', url.toString());
      
      // Ajouter le token d'authentification
      const token = localStorage.getItem('token');
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Effectuer la requête avec fetch
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Réponse notifications non lues:', data);
      
      return data;
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications non lues:', err);
      throw err;
    }
  }
};

// Fonctions API pour les paiements
export const paymentsAPI = {
  createPaymentIntent(planId) {
    return api.post('/payments/create-payment-intent', { planId });
  },
  confirmPayment(paymentIntentId) {
    return api.post('/payments/confirm', { paymentIntentId });
  },
  getPaymentHistory() {
    return api.get('/payments/history');
  },
  getSubscriptionPlans() {
    return api.get('/payments/plans');
  }
};

// Alias pour la compatibilité avec les anciens noms d'API
export const userAPI = usersAPI;
export const jobAPI = jobsAPI;
export const applicationAPI = applicationsAPI;
export const messageAPI = messagesAPI;
export const notificationAPI = notificationsAPI;
export const paymentAPI = paymentsAPI;

export default api;
