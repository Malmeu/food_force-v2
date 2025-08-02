import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, Chip, CircularProgress, Alert, Grid, 
  FormHelperText, Checkbox, FormControlLabel, FormGroup, Divider
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { jobsAPI } from '../../utils/api';

const CreateJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Valeurs initiales du formulaire
  const initialValues = {
    title: '',
    description: '',
    contractType: '',
    sector: '',
    location: {
      address: '',
      city: '',
      region: ''
    },
    salary: {
      amount: '',
      period: '',
      currency: 'MAD'
    },
    requiredSkills: [],
    newSkill: '',
    workingHours: {
      start: '',
      end: ''
    },
    workingDays: [],
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    numberOfPositions: 1,
    experienceLevel: '',
    educationLevel: '',
    benefits: [],
    newBenefit: ''
  };

  // Schéma de validation Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('Le titre est requis').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
    description: Yup.string().required('La description est requise'),
    contractType: Yup.string().required('Le type de contrat est requis')
      .oneOf(['CDI', 'CDD', 'Intérim', 'Extra'], 'Type de contrat invalide'),
    sector: Yup.string().required('Le secteur est requis')
      .oneOf(['Restauration', 'Hôtellerie', 'Événementiel', 'Vente', 'Logistique'], 'Secteur invalide'),
    location: Yup.object().shape({
      city: Yup.string().required('La ville est requise'),
      address: Yup.string(),
      region: Yup.string()
    }),
    salary: Yup.object().shape({
      amount: Yup.number().required('Le montant du salaire est requis').positive('Le salaire doit être positif'),
      period: Yup.string().required('La période du salaire est requise')
        .oneOf(['Heure', 'Jour', 'Mois'], 'Période invalide'),
      currency: Yup.string().default('MAD')
    }),
    startDate: Yup.date().required('La date de début est requise'),
    experienceLevel: Yup.string().required('Le niveau d\'expérience est requis')
      .oneOf(['Débutant', 'Intermédiaire', 'Expérimenté', 'Expert'], 'Niveau d\'expérience invalide'),
    numberOfPositions: Yup.number().required('Le nombre de postes est requis').positive('Le nombre doit être positif').integer('Le nombre doit être un entier'),
    workingHours: Yup.object().shape({
      start: Yup.string(),
      end: Yup.string()
    })
  });

  // Gestion de la soumission du formulaire
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Début de la soumission du formulaire');
      setError('');
      setSuccess(false);
      
      // Vérifier si l'utilisateur est connecté
      if (!user) {
        setError('Vous devez être connecté pour créer une offre d\'emploi');
        return;
      }

      // Vérifier si l'utilisateur est un établissement
      if (user.userType !== 'etablissement') {
        setError('Seuls les établissements peuvent créer des offres d\'emploi');
        return;
      }

      // Formatage des données pour correspondre au modèle MongoDB
      const jobData = {
        title: values.title,
        description: values.description,
        contractType: values.contractType,
        sector: values.sector,
        status: 'active', // Définir le statut comme actif par défaut
        location: {
          address: values.location.address,
          city: values.location.city,
          region: values.location.region || ''
        },
        salary: {
          amount: Number(values.salary.amount),
          period: values.salary.period,
          currency: values.salary.currency
        },
        requiredSkills: values.requiredSkills,
        workingHours: {
          start: values.workingHours.start,
          end: values.workingHours.end
        },
        workingDays: values.workingDays,
        startDate: new Date(values.startDate),
        endDate: values.endDate ? new Date(values.endDate) : undefined,
        applicationDeadline: values.applicationDeadline ? new Date(values.applicationDeadline) : undefined,
        numberOfPositions: Number(values.numberOfPositions),
        experienceLevel: values.experienceLevel,
        educationLevel: values.educationLevel || undefined,
        benefits: values.benefits
      };

      console.log('Données de l\'offre formatées:', jobData);

      // Envoi des données à l'API en utilisant jobsAPI
      const response = await jobsAPI.createJob(jobData);
      console.log('Réponse de l\'API:', response.data);
      
      if (!response.data) {
        throw new Error('Erreur lors de la création de l\'offre');
      }
      
      // Affichage d'un message de succès
      setSuccess(true);
      toast.success('Offre d\'emploi créée avec succès!');
      resetForm();
    } catch (err) {
      console.error('Erreur lors de la création de l\'offre:', err);
      
      // Gestion simplifiée des erreurs
      let errorMessage = 'Une erreur est survenue lors de la création de l\'offre.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Fonction pour ajouter une compétence à la liste
  const handleAddSkill = (values, setFieldValue) => {
    if (values.newSkill && !values.requiredSkills.includes(values.newSkill)) {
      setFieldValue('requiredSkills', [...values.requiredSkills, values.newSkill]);
      setFieldValue('newSkill', '');
    }
  };

  // Fonction pour supprimer une compétence de la liste
  const handleRemoveSkill = (skill, values, setFieldValue) => {
    setFieldValue('requiredSkills', values.requiredSkills.filter(s => s !== skill));
  };

  // Fonction pour ajouter un avantage à la liste
  const handleAddBenefit = (values, setFieldValue) => {
    if (values.newBenefit && !values.benefits.includes(values.newBenefit)) {
      setFieldValue('benefits', [...values.benefits, values.newBenefit]);
      setFieldValue('newBenefit', '');
    }
  };

  // Fonction pour supprimer un avantage de la liste
  const handleRemoveBenefit = (benefit, values, setFieldValue) => {
    setFieldValue('benefits', values.benefits.filter(b => b !== benefit));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Créer une nouvelle offre d'emploi
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Offre d'emploi créée avec succès!
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue, resetForm }) => (
            <Form>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Titre du poste"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && errors.title}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description du poste"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                    margin="normal"
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Détails du contrat
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={touched.contractType && Boolean(errors.contractType)}>
                    <InputLabel id="contractType-label">Type de contrat</InputLabel>
                    <Select
                      labelId="contractType-label"
                      id="contractType"
                      name="contractType"
                      value={values.contractType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Type de contrat"
                    >
                      <MenuItem value="CDI">CDI</MenuItem>
                      <MenuItem value="CDD">CDD</MenuItem>
                      <MenuItem value="Intérim">Intérim</MenuItem>
                      <MenuItem value="Extra">Extra</MenuItem>
                    </Select>
                    {touched.contractType && errors.contractType && (
                      <FormHelperText>{errors.contractType}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={touched.sector && Boolean(errors.sector)}>
                    <InputLabel id="sector-label">Secteur</InputLabel>
                    <Select
                      labelId="sector-label"
                      id="sector"
                      name="sector"
                      value={values.sector}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Secteur"
                    >
                      <MenuItem value="Restauration">Restauration</MenuItem>
                      <MenuItem value="Hôtellerie">Hôtellerie</MenuItem>
                      <MenuItem value="Événementiel">Événementiel</MenuItem>
                      <MenuItem value="Vente">Vente</MenuItem>
                      <MenuItem value="Logistique">Logistique</MenuItem>
                    </Select>
                    {touched.sector && errors.sector && (
                      <FormHelperText>{errors.sector}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Localisation et salaire
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="location.city"
                    name="location.city"
                    label="Ville"
                    value={values.location.city}
                    onChange={(e) => {
                      setFieldValue('location.city', e.target.value);
                    }}
                    onBlur={handleBlur}
                    error={touched.location?.city && Boolean(errors.location?.city)}
                    helperText={touched.location?.city && errors.location?.city}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    id="location.address"
                    name="location.address"
                    label="Adresse"
                    value={values.location.address}
                    onChange={(e) => {
                      setFieldValue('location.address', e.target.value);
                    }}
                    onBlur={handleBlur}
                    error={touched.location?.address && Boolean(errors.location?.address)}
                    helperText={touched.location?.address && errors.location?.address}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="salary.amount"
                    name="salary.amount"
                    label="Montant du salaire"
                    type="number"
                    value={values.salary.amount}
                    onChange={(e) => {
                      setFieldValue('salary.amount', e.target.value);
                    }}
                    onBlur={handleBlur}
                    error={touched.salary?.amount && Boolean(errors.salary?.amount)}
                    helperText={touched.salary?.amount && errors.salary?.amount}
                    margin="normal"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth margin="normal" error={touched.salary?.period && Boolean(errors.salary?.period)}>
                    <InputLabel id="salary.period-label">Période</InputLabel>
                    <Select
                      labelId="salary.period-label"
                      id="salary.period"
                      name="salary.period"
                      value={values.salary.period}
                      onChange={(e) => {
                        setFieldValue('salary.period', e.target.value);
                      }}
                      onBlur={handleBlur}
                      label="Période"
                    >
                      <MenuItem value="Heure">Par heure</MenuItem>
                      <MenuItem value="Jour">Par jour</MenuItem>
                      <MenuItem value="Mois">Par mois</MenuItem>
                    </Select>
                    {touched.salary?.period && errors.salary?.period && (
                      <FormHelperText>{errors.salary?.period}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Expérience et éducation
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal" error={touched.experienceLevel && Boolean(errors.experienceLevel)}>
                    <InputLabel id="experienceLevel-label">Niveau d'expérience</InputLabel>
                    <Select
                      labelId="experienceLevel-label"
                      id="experienceLevel"
                      name="experienceLevel"
                      value={values.experienceLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Niveau d'expérience"
                    >
                      <MenuItem value="Débutant">Débutant</MenuItem>
                      <MenuItem value="Intermédiaire">Intermédiaire</MenuItem>
                      <MenuItem value="Expérimenté">Expérimenté</MenuItem>
                      <MenuItem value="Expert">Expert</MenuItem>
                    </Select>
                    {touched.experienceLevel && errors.experienceLevel && (
                      <FormHelperText>{errors.experienceLevel}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="educationLevel-label">Niveau d'éducation</InputLabel>
                    <Select
                      labelId="educationLevel-label"
                      id="educationLevel"
                      name="educationLevel"
                      value={values.educationLevel}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Niveau d'éducation"
                    >
                      <MenuItem value="Aucun diplôme">Aucun diplôme</MenuItem>
                      <MenuItem value="Bac">Bac</MenuItem>
                      <MenuItem value="Bac+2">Bac+2</MenuItem>
                      <MenuItem value="Bac+3">Bac+3</MenuItem>
                      <MenuItem value="Bac+5">Bac+5</MenuItem>
                      <MenuItem value="Doctorat">Doctorat</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Compétences requises
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  id="newSkill"
                  name="newSkill"
                  label="Ajouter une compétence"
                  value={values.newSkill}
                  onChange={handleChange}
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => handleAddSkill(values, setFieldValue)}
                >
                  Ajouter
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {values.requiredSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill, values, setFieldValue)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Horaires et dates
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="workingHours.start"
                    name="workingHours.start"
                    label="Heure de début"
                    type="time"
                    value={values.workingHours.start}
                    onChange={(e) => {
                      setFieldValue('workingHours.start', e.target.value);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 minutes
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="workingHours.end"
                    name="workingHours.end"
                    label="Heure de fin"
                    type="time"
                    value={values.workingHours.end}
                    onChange={(e) => {
                      setFieldValue('workingHours.end', e.target.value);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 minutes
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl component="fieldset" margin="normal">
                    <Typography variant="subtitle1">Jours de travail</Typography>
                    <FormGroup row>
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                        <FormControlLabel
                          key={day}
                          control={
                            <Checkbox
                              checked={values.workingDays.includes(day)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFieldValue('workingDays', [...values.workingDays, day]);
                                } else {
                                  setFieldValue('workingDays', values.workingDays.filter(d => d !== day));
                                }
                              }}
                              name={day}
                            />
                          }
                          label={day}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="startDate"
                    name="startDate"
                    label="Date de début"
                    type="date"
                    value={values.startDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.startDate && Boolean(errors.startDate)}
                    helperText={touched.startDate && errors.startDate}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="numberOfPositions"
                    name="numberOfPositions"
                    label="Nombre de postes à pourvoir"
                    type="number"
                    value={values.numberOfPositions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numberOfPositions && Boolean(errors.numberOfPositions)}
                    helperText={touched.numberOfPositions && errors.numberOfPositions}
                    margin="normal"
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={() => resetForm()}
                  disabled={isSubmitting}
                  sx={{ mr: 2 }}
                >
                  Réinitialiser
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Créer l\'offre'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default CreateJobPage;
