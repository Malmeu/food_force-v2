import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Le mot de passe est requis'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation du mot de passe est requise'),
});

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authAPI.resetPassword(token, values.password);
      setSuccess(true);
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setSuccess(false);
      setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Réinitialiser votre mot de passe
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Veuillez entrer votre nouveau mot de passe ci-dessous.
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Nouveau mot de passe"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                margin="normal"
              />
              
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                margin="normal"
              />
              
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Réinitialiser le mot de passe
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
