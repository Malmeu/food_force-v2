import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const PrivateRoute = ({ userType }) => {
  const { user, loading, isAuthenticated, authInitialized } = useAuth();
  const location = useLocation();
  const [waitTime, setWaitTime] = useState(0);
  
  // Compter le temps d'attente si le chargement prend trop de temps
  useEffect(() => {
    let timer;
    if (loading && !isAuthenticated) {
      timer = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    } else {
      setWaitTime(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, isAuthenticated]);
  
  // Fonction pour rafraîchir manuellement la page
  const handleManualRefresh = () => {
    console.log('Rafraîchissement manuel demandé');
    // Recharger la page sans utiliser le cache du navigateur
    window.location.reload(true);
  };

  // Si l'authentification n'est pas encore initialisée, afficher un spinner
  if (!authInitialized) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Initialisation de l'application...
        </Typography>
      </Box>
    );
  }

  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Chargement en cours...
        </Typography>
        
        {/* Afficher un message et un bouton de rafraîchissement si l'attente est longue */}
        {waitTime > 5 && (
          <>
            <Typography variant="body1" sx={{ mt: 1, mb: 2, textAlign: 'center', maxWidth: '80%' }}>
              Le chargement semble prendre plus de temps que prévu.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<RefreshIcon />}
              onClick={handleManualRefresh}
              sx={{ mt: 1 }}
            >
              Rafraîchir la page
            </Button>
          </>
        )}
      </Box>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    console.log('PrivateRoute - Utilisateur non authentifié, redirection vers /login');
    // Sauvegarder l'URL actuelle pour rediriger l'utilisateur après connexion
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si un type d'utilisateur spécifique est requis, vérifier le type de l'utilisateur
  if (userType && user.userType !== userType) {
    // Rediriger vers le tableau de bord approprié
    const redirectPath = user.userType === 'candidat' ? '/candidate/dashboard' : '/establishment/dashboard';
    console.log(`PrivateRoute - Type d'utilisateur incorrect, redirection vers ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Si tout est OK, afficher les routes enfants
  console.log('PrivateRoute - Accès autorisé aux routes enfants');
  return <Outlet />;
};

export default PrivateRoute;
