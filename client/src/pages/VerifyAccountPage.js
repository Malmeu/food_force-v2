import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Paper, Button, CircularProgress, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { authAPI } from '../utils/api';

const VerifyAccountPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        await authAPI.verifyAccount(token);
        setSuccess(true);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de la vérification de votre compte');
        setLoading(false);
      }
    };

    verifyAccount();
  }, [token]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Vérification de votre compte en cours...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {success ? (
          <>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Félicitations ! Votre compte a été vérifié avec succès.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              Vous pouvez maintenant vous connecter et accéder à toutes les fonctionnalités de FoodForce Maroc.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button component={Link} to="/login" variant="contained" color="primary">
                Se connecter
              </Button>
            </Box>
          </>
        ) : (
          <>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Échec de la vérification
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Le lien de vérification est peut-être expiré ou invalide. Veuillez contacter le support si vous avez besoin d'aide.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button component={Link} to="/" variant="contained" color="primary">
                Retour à l'accueil
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyAccountPage;
