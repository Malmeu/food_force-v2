import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user, error } = useAuth();
  const isAuthenticated = !!user;
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      // Rediriger vers le tableau de bord approprié
      const redirectPath = user.userType === 'candidat' ? '/candidate/dashboard' : '/establishment/dashboard';
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, user]);

  // Schéma de validation
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email invalide')
      .required('L\'email est requis'),
    password: Yup.string()
      .required('Le mot de passe est requis'),
  });

  // Configuration de Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      handleLogin(values);
    },
  });

  // Gérer la connexion
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      console.log('Tentative de connexion avec:', values.email);
      await login(values.email, values.password);
      toast.success('Connexion réussie !');
    } catch (error) {
      console.error('Erreur de connexion dans LoginPage:', error);
      // Gestion améliorée des erreurs sans dépendre de la structure axios
      let errorMessage = 'Identifiants invalides';
      if (error.message) {
        if (error.message.includes('HTTP:')) {
          errorMessage = 'Problème de connexion au serveur. Veuillez réessayer plus tard.';
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Connexion
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Connectez-vous pour accéder à votre compte
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mot de passe"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Typography color="primary" variant="body2">
              Mot de passe oublié ?
            </Typography>
          </Link>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" align="center">
          Vous n'avez pas de compte ?
          <Link to="/register" style={{ textDecoration: 'none', marginLeft: 1 }}>
            <Typography component="span" color="primary" variant="body1">
              Inscrivez-vous
            </Typography>
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
