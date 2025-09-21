import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Fonction utilitaire pour ru00e9cupu00e9rer l'utilisateur du cache
const getUserFromCache = () => {
  try {
    const cachedUser = localStorage.getItem('user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration du cache utilisateur:', error);
    return null;
  }
};

// Déterminer la baseURL en fonction de l'environnement
const isProduction = process.env.NODE_ENV === 'production';
const AUTH_API_BASE_URL = isProduction 
  ? 'https://food-force-api.onrender.com/api'
  : 'https://food-force-api.onrender.com/api'; // Utiliser l'API Render même en développement

// Log pour le du00e9bogage
console.log(`Auth API configuru00e9e avec baseURL: ${AUTH_API_BASE_URL} (${isProduction ? 'production' : 'du00e9veloppement'})`);

// Cru00e9er une instance axios avec la configuration de base pour l'authentification
const authAxios = axios.create({
  baseURL: AUTH_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    // Suppression des en-têtes problématiques pour CORS
  },
  timeout: 15000 // 15 secondes de timeout pour donner plus de temps aux requêtes
});

// Intercepteur pour ajouter le token d'authentification
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  // Initialiser l'u00e9tat utilisateur avec les donnu00e9es en cache du00e8s le du00e9part
  const [user, setUser] = useState(getUserFromCache());
  const [loading, setLoading] = useState(true); // Du00e9marrer avec loading=true
  const [authInitialized, setAuthInitialized] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Vu00e9rifier l'authentification au chargement initial
  useEffect(() => {
    const checkAuth = async () => {
      // Si nous n'avons pas de token, pas besoin de vu00e9rifier
      if (!localStorage.getItem('token')) {
        setUser(null);
        setLoading(false);
        setAuthInitialized(true);
        return;
      }
      
      // Si nous avons du00e9ju00e0 un utilisateur du cache, utiliser celui-ci immu00e9diatement
      const cachedUser = getUserFromCache();
      if (cachedUser) {
        setUser(cachedUser);
        // Ne pas du00e9sactiver le chargement ici, continuer u00e0 vu00e9rifier avec l'API
      }
      
      // Vu00e9rifier l'authentification avec l'API
      try {
        // Cru00e9er un AbortController pour pouvoir annuler la requu00eate si nu00e9cessaire
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 secondes de timeout
        
        const response = await authAxios.get('/auth/me', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Si la réponse contient directement les données utilisateur
        if (response && response.data) {
          // Si la réponse a une structure success/user
          if (response.data.success && response.data.user) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          } 
          // Si la réponse est directement l'objet utilisateur
          else if (response.data.id || response.data._id) {
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          }
          // Si pas de donnu00e9es utilisateur valides, mais la requu00eate a ru00e9ussi, utiliser le cache
          else if (cachedUser) {
            console.log('Pas de donnu00e9es utilisateur valides de l\'API, utilisation du cache');
            setUser(cachedUser);
          } else {
            setUser(null);
          }
        } else if (cachedUser) {
          // Si pas de réponse valide mais cache disponible
          setUser(cachedUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Erreur lors de la vu00e9rification de l\'authentification:', err);
        
        // Si l'erreur est une annulation, utiliser le cache
        if (err.name === 'AbortError' || err.name === 'CanceledError' || err.message === 'canceled') {
          console.warn('Requu00eate d\'authentification annulu00e9e - Utilisation du cache');
          if (cachedUser) {
            setUser(cachedUser);
          }
        }
        // Si l'erreur est 401, l'utilisateur n'est pas authentifiu00e9
        else if (err.response && err.response.status === 401) {
          console.warn('Token invalide (401) - Du00e9connexion');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
        // Pour les autres erreurs, conserver l'utilisateur du cache si disponible
        else if (cachedUser) {
          console.warn('Erreur ru00e9seau - Utilisation du cache utilisateur');
          setUser(cachedUser);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };
    
    checkAuth();
    
    // Du00e9tecter les actualisations de page
    const handleBeforeUnload = () => {
      sessionStorage.setItem('isRefreshing', 'true');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Effet pour surveiller les changements de route
  useEffect(() => {
    // Seulement si l'authentification a du00e9ju00e0 u00e9tu00e9 initialisu00e9e
    if (authInitialized) {
      // Vu00e9rifier si nous venons d'actualiser la page
      const isRefreshing = sessionStorage.getItem('isRefreshing') === 'true';
      if (isRefreshing) {
        sessionStorage.removeItem('isRefreshing');
        // Utiliser immu00e9diatement les donnu00e9es en cache
        const cachedUser = getUserFromCache();
        if (cachedUser) {
          setUser(cachedUser);
        }
      }
    }
  }, [location.pathname, authInitialized]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser axios au lieu de fetch pour une meilleure gestion des erreurs
      console.log('Tentative de connexion avec:', email);
      
      // Utiliser un proxy CORS pour contourner les restrictions
      const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const apiUrl = 'https://food-force-api.onrender.com/api/auth/login';
      const url = process.env.NODE_ENV === 'development' ? apiUrl : corsProxyUrl + apiUrl;
      
      console.log('URL de connexion:', url);
      
      // Utiliser axios pour la requête
      const response = await axios.post(url, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Origin': window.location.origin
        }
      });
      
      // Simuler une réponse fetch pour maintenir la compatibilité avec le reste du code
      const fetchResponse = {
        ok: true,
        status: 200,
        json: async () => response.data
      };
      
      // Vérifier si la réponse est OK
      if (!fetchResponse.ok) {
        // Afficher le contenu de la réponse pour débogage
        const textResponse = await fetchResponse.text();
        console.error(`Erreur HTTP ${fetchResponse.status}:`, textResponse);
        throw new Error(`Erreur HTTP: ${fetchResponse.status} - ${fetchResponse.statusText}`);
      }
      
      // Parser la réponse JSON
      let responseData;
      try {
        responseData = await fetchResponse.json();
        console.log('Réponse API complète:', responseData);
      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError);
        throw new Error(`Erreur de format JSON: ${jsonError.message}`);
      }
      
      // Vérifier si la réponse contient un token et des données utilisateur
      if (responseData && responseData.success && responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        setUser(responseData.user);
        setError(null);
        
        // Rediriger vers la page d'où l'utilisateur venait ou vers le tableau de bord approprié
        const from = location.state?.from;
        
        // Si une page spécifique est demandée, y rediriger
        if (from) {
          navigate(from, { replace: true });
        } else {
          // Sinon, rediriger vers le tableau de bord approprié en fonction du type d'utilisateur
          const dashboardPath = responseData.user.userType === 'candidat' 
            ? '/candidate/dashboard' 
            : '/establishment/dashboard';
          console.log('Redirection vers', dashboardPath);
          navigate(dashboardPath, { replace: true });
        }
        
        return responseData.user;
      } else {
        throw new Error(responseData?.message || 'Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Erreur lors de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAxios.post('/auth/register', userData);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const updateProfile = (userData) => {
    console.log('Mise à jour du profil dans le contexte avec données:', userData);
    
    // Fonction pour fusion profonde des objets
    const deepMerge = (target, source) => {
      if (!source) return target;
      
      const output = { ...target };
      
      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          // Si la propriété existe dans la cible et est aussi un objet, fusion récursive
          if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
            output[key] = deepMerge(target[key], source[key]);
          } else {
            // Sinon, copier l'objet source
            output[key] = { ...source[key] };
          }
        } else {
          // Pour les valeurs primitives ou tableaux, remplacer directement
          output[key] = source[key];
        }
      });
      
      return output;
    };
    
    // Mettre à jour l'utilisateur avec fusion profonde
    const updatedUser = deepMerge(user, userData);
    console.log('Utilisateur après fusion profonde:', updatedUser);
    
    // Mettre à jour l'état et le stockage local
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        authInitialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
