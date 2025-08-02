import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Tabs,
  Tab,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Autocomplete,
} from '@mui/material';

import { getCities, getRegionForCity } from '../utils/moroccanCities';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user } = useAuth();
  const isAuthenticated = !!user;
  
  // Obtenir le type d'utilisateur à partir des paramètres d'URL
  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get('type');
  
  const [userType, setUserType] = useState(typeFromUrl === 'etablissement' ? 'etablissement' : 'candidat');
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Étapes d'inscription
  const steps = ['Informations de base', 'Détails du profil', 'Confirmation'];

  // Schéma de validation pour l'étape 1
  const validationSchemaStep1 = Yup.object({
    email: Yup.string()
      .email('Email invalide')
      .required('L\'email est requis'),
    password: Yup.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .required('Le mot de passe est requis'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
      .required('La confirmation du mot de passe est requise'),
    phone: Yup.string()
      .required('Le numéro de téléphone est requis'),
  });

  // Schéma de validation pour l'étape 2 - Candidat
  const validationSchemaStep2Candidate = Yup.object().shape({
    candidateProfile: Yup.object().shape({
      firstName: Yup.string().required('Le prénom est requis'),
      lastName: Yup.string().required('Le nom est requis')
    }),
    address: Yup.object().shape({
      city: Yup.string().required('La ville est requise')
    })
  });

  // Schéma de validation pour l'étape 2 - Établissement
  const validationSchemaStep2Establishment = Yup.object().shape({
    establishmentProfile: Yup.object().shape({
      name: Yup.string().required('Le nom de l\'établissement est requis'),
      sector: Yup.string().required('Le secteur d\'activité est requis')
    }),
    address: Yup.object().shape({
      city: Yup.string().required('La ville est requise')
    })
  });

  // Valeurs initiales du formulaire
  const initialValues = {
    userType,
    email: '',
    password: '',
    confirmPassword: '',
    phone: '+212',
    address: {
      street: '',
      city: '',
      postalCode: '',
      region: '',
      country: 'Maroc',
    },
    candidateProfile: {
      firstName: '',
      lastName: '',
      birthDate: '',
      skills: [],
      preferredSectors: [],
      preferredContractTypes: [],
    },
    establishmentProfile: {
      name: '',
      description: '',
      sector: '',
      companySize: '',
      contactPerson: {
        firstName: '',
        lastName: '',
        position: '',
      },
    },
  };

  // Configuration de Formik
  const formik = useFormik({
    initialValues,
    validationSchema: activeStep === 0 
      ? validationSchemaStep1 
      : (userType === 'candidat' ? validationSchemaStep2Candidate : validationSchemaStep2Establishment),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        // Valider l'étape actuelle avant de passer à la suivante
        try {
          if (activeStep === 0) {
            await validationSchemaStep1.validate(values, { abortEarly: false });
            setActiveStep(activeStep + 1);
          } else if (activeStep === 1) {
            // Pour l'étape 2, nous passons directement à l'étape suivante sans validation stricte
            // car les erreurs de validation sont déjà affichées dans l'interface
            // et nous voulons permettre à l'utilisateur de continuer même si certains champs optionnels ne sont pas remplis
            setActiveStep(activeStep + 1);
          }
        } catch (err) {
          console.error('Erreur de validation:', err);
          // Afficher les erreurs dans l'interface si nécessaire
        }
      } else {
        // Soumettre le formulaire final
        handleRegister(values);
      }
    },
  });

  // Gérer le changement de type d'utilisateur
  const handleUserTypeChange = (event, newValue) => {
    setUserType(newValue);
    formik.setFieldValue('userType', newValue);
  };

  // Gérer l'inscription
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Supprimer les champs inutiles selon le type d'utilisateur
      const userData = { ...values };
      delete userData.confirmPassword;
      
      if (userData.userType === 'candidat') {
        delete userData.establishmentProfile;
      } else {
        delete userData.candidateProfile;
      }

      await register(userData);
      toast.success('Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Gérer le retour à l'étape précédente
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Créer un compte
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          {activeStep === 0 && (
            <>
              <Tabs
                value={userType}
                onChange={handleUserTypeChange}
                centered
                sx={{ mb: 4 }}
              >
                <Tab value="candidat" label="Je suis candidat" />
                <Tab value="etablissement" label="Je suis un établissement" />
              </Tabs>

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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Numéro de téléphone"
                    value={formik.values.phone}
                    onChange={(e) => {
                      // Supprime tous les caractères non numériques
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      // Si la valeur ne commence pas par +212, l'ajouter
                      formik.setFieldValue('phone', value.startsWith('212') ? `+${value}` : `+212${value}`);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={(formik.touched.phone && formik.errors.phone) || "Format: +212XXXXXXXXX"}
                    InputProps={{
                      startAdornment: (
                        <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>+212</Typography>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {activeStep === 1 && userType === 'candidat' && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.firstName"
                  name="candidateProfile.firstName"
                  label="Prénom"
                  value={formik.values.candidateProfile.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.candidateProfile?.firstName && Boolean(formik.errors.candidateProfile?.firstName)}
                  helperText={formik.touched.candidateProfile?.firstName && formik.errors.candidateProfile?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.lastName"
                  name="candidateProfile.lastName"
                  label="Nom"
                  value={formik.values.candidateProfile.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.candidateProfile?.lastName && Boolean(formik.errors.candidateProfile?.lastName)}
                  helperText={formik.touched.candidateProfile?.lastName && formik.errors.candidateProfile?.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.birthDate"
                  name="candidateProfile.birthDate"
                  label="Date de naissance"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.candidateProfile.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="preferred-sectors-label">Secteurs préférés</InputLabel>
                  <Select
                    labelId="preferred-sectors-label"
                    id="candidateProfile.preferredSectors"
                    name="candidateProfile.preferredSectors"
                    multiple
                    value={formik.values.candidateProfile.preferredSectors}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="Restauration">Restauration</MenuItem>
                    <MenuItem value="Hôtellerie">Hôtellerie</MenuItem>
                    <MenuItem value="Événementiel">Événementiel</MenuItem>
                    <MenuItem value="Vente">Vente</MenuItem>
                    <MenuItem value="Logistique">Logistique</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address.street"
                  name="address.street"
                  label="Adresse"
                  value={formik.values.address.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="address.city-autocomplete"
                  options={getCities()}
                  fullWidth
                  value={formik.values.address.city}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('address.city', newValue || '');
                    if (newValue) {
                      formik.setFieldValue('address.region', getRegionForCity(newValue));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="address.city"
                      name="address.city"
                      label="Ville"
                      error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                      helperText={formik.touched.address?.city && formik.errors.address?.city}
                      onBlur={formik.handleBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address.region"
                  name="address.region"
                  label="Région"
                  value={formik.values.address.region || getRegionForCity(formik.values.address.city) || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address.postalCode"
                  name="address.postalCode"
                  label="Code postal"
                  value={formik.values.address.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && userType === 'etablissement' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.name"
                  name="establishmentProfile.name"
                  label="Nom de l'établissement"
                  value={formik.values.establishmentProfile.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.establishmentProfile?.name && Boolean(formik.errors.establishmentProfile?.name)}
                  helperText={formik.touched.establishmentProfile?.name && formik.errors.establishmentProfile?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.description"
                  name="establishmentProfile.description"
                  label="Description de l'établissement"
                  multiline
                  rows={4}
                  value={formik.values.establishmentProfile.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="sector-label">Secteur d'activité</InputLabel>
                  <Select
                    labelId="sector-label"
                    id="establishmentProfile.sector"
                    name="establishmentProfile.sector"
                    value={formik.values.establishmentProfile.sector}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.establishmentProfile?.sector && Boolean(formik.errors.establishmentProfile?.sector)}
                  >
                    <MenuItem value="Restauration">Restauration</MenuItem>
                    <MenuItem value="Hôtellerie">Hôtellerie</MenuItem>
                    <MenuItem value="Événementiel">Événementiel</MenuItem>
                    <MenuItem value="Vente">Vente</MenuItem>
                    <MenuItem value="Logistique">Logistique</MenuItem>
                  </Select>
                  {formik.touched.establishmentProfile?.sector && formik.errors.establishmentProfile?.sector && (
                    <FormHelperText error>{formik.errors.establishmentProfile.sector}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="company-size-label">Taille de l'entreprise</InputLabel>
                  <Select
                    labelId="company-size-label"
                    id="establishmentProfile.companySize"
                    name="establishmentProfile.companySize"
                    value={formik.values.establishmentProfile.companySize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="Petite">Petite (1-10 employés)</MenuItem>
                    <MenuItem value="Moyenne">Moyenne (11-50 employés)</MenuItem>
                    <MenuItem value="Grande">Grande (51+ employés)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address.street"
                  name="address.street"
                  label="Adresse"
                  value={formik.values.address.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="address.city-autocomplete-establishment"
                  options={getCities()}
                  fullWidth
                  value={formik.values.address.city}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('address.city', newValue || '');
                    if (newValue) {
                      formik.setFieldValue('address.region', getRegionForCity(newValue));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="address.city"
                      name="address.city"
                      label="Ville"
                      error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                      helperText={formik.touched.address?.city && formik.errors.address?.city}
                      onBlur={formik.handleBlur}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address.region"
                  name="address.region"
                  label="Région"
                  value={formik.values.address.region || getRegionForCity(formik.values.address.city) || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="address.postalCode"
                  name="address.postalCode"
                  label="Code postal"
                  value={formik.values.address.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Personne à contacter
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="establishmentProfile.contactPerson.firstName"
                  name="establishmentProfile.contactPerson.firstName"
                  label="Prénom"
                  value={formik.values.establishmentProfile.contactPerson.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="establishmentProfile.contactPerson.lastName"
                  name="establishmentProfile.contactPerson.lastName"
                  label="Nom"
                  value={formik.values.establishmentProfile.contactPerson.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.contactPerson.position"
                  name="establishmentProfile.contactPerson.position"
                  label="Poste"
                  value={formik.values.establishmentProfile.contactPerson.position}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                Vérifiez vos informations
              </Typography>
              <Typography variant="body1" paragraph>
                Vous êtes sur le point de créer un compte {userType === 'candidat' ? 'candidat' : 'établissement'}.
              </Typography>
              <Typography variant="body1" paragraph>
                Un email de confirmation sera envoyé à {formik.values.email} pour activer votre compte.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                En cliquant sur "Créer mon compte", vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} variant="outlined">
                Retour
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ ml: 'auto' }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : activeStep === steps.length - 1 ? (
                'Créer mon compte'
              ) : (
                'Suivant'
              )}
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Connectez-vous
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
