import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

// Hook personnalisu00e9 pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configurer l'en-tête d'autorisation par défaut
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Vérifier si le token est valide
      try {
        const decoded = jwt_decode(token);
        // Vérifier si le token est expiré
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expiré
          logout();
        } else {
          // Charger les informations de l'utilisateur
          loadUser();
        }
      } catch (err) {
        // Token invalide
        logout();
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  // Charger les informations de l'utilisateur
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.data);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (err) {
      console.error('Erreur de chargement utilisateur:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      // Utiliser l'API configuru00e9e avec la bonne URL de base
      const res = await axios.post('/api/auth/register', userData);
      return res.data;
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      throw err;
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', token);
      
      // Mettre à jour l'état
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.message || 'Identifiants invalides');
      throw err;
    }
  };

  // Déconnexion
  const logout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    
    // Réinitialiser l'état
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    
    // Supprimer l'en-tête d'autorisation
    delete axios.defaults.headers.common['Authorization'];
  };

  // Mot de passe oublié
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la demande de réinitialisation');
      throw err;
    }
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (token, password) => {
    try {
      const res = await axios.put(`/api/auth/reset-password/${token}`, { password });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
      throw err;
    }
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await axios.put('/api/auth/update-password', { currentPassword, newPassword });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
