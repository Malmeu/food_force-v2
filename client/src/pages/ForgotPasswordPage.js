import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Alert } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { authAPI } from '../utils/api';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est requis'),
});

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await authAPI.forgotPassword(values.email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setSuccess(false);
      setError(error.response?.data?.message || 'Une erreur est survenue. Veuillez ru00e9essayer.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mot de passe oubliu00e9
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Entrez votre adresse email et nous vous enverrons un lien pour ru00e9initialiser votre mot de passe.
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Un email de ru00e9initialisation a u00e9tu00e9 envoyu00e9 u00e0 l'adresse indiquu00e9e si elle est associu00e9e u00e0 un compte.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Adresse email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
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
                  Envoyer le lien de ru00e9initialisation
                </Button>
              </Box>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Retour u00e0 la connexion
                  </Typography>
                </Link>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
