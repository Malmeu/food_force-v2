import React from 'react';
import { Box, Paper, Typography, Alert, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center">
          Veuillez vous connecter pour accéder à cette page
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 4 }}>
          <InfoIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Messagerie désactivée
          </Typography>
          
          <Typography variant="body1" paragraph>
            Pour des raisons de confidentialité et de protection des candidats, la messagerie directe a été désactivée sur notre plateforme.
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, mb: 3, width: '100%' }}>
            <Typography variant="body2">
              Les établissements ne peuvent plus contacter directement les candidats par messagerie. Les candidats seront contactés par email ou téléphone uniquement après avoir postulé à une offre d'emploi.
            </Typography>
          </Alert>
          
          {user?.userType === 'establishment' ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Vous êtes un établissement ?
              </Typography>
              <Typography variant="body2" paragraph>
                Vous pouvez consulter les candidatures reçues et contacter les candidats via leurs coordonnées après qu'ils aient postulé.
              </Typography>
              <Button 
                component={Link} 
                to="/establishment/applications" 
                variant="contained" 
                color="primary"
                sx={{ mt: 1 }}
              >
                Gérer mes candidatures
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Vous êtes un candidat ?
              </Typography>
              <Typography variant="body2" paragraph>
                Consultez vos candidatures et attendez d'être contacté par les établissements intéressés par votre profil.
              </Typography>
              <Button 
                component={Link} 
                to="/candidate/applications" 
                variant="contained" 
                color="primary"
                sx={{ mt: 1 }}
              >
                Voir mes candidatures
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default MessagesPage;
