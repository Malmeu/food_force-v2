import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, Chip, CircularProgress, Alert, Grid, 
  FormHelperText, Checkbox, FormControlLabel, FormGroup, Divider, Stepper,
  Step, StepLabel, StepContent, Card, CardContent, useTheme, alpha, StepButton
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import { jobsAPI } from '../../utils/api';
import PaymentModal from '../../components/payment/PaymentModal';

const CreateJobPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [jobDataToSubmit, setJobDataToSubmit] = useState(null);
  const theme = useTheme();
  
  // Étapes du formulaire
  const steps = [
    { label: 'Informations générales', description: 'Titre et description du poste' },
    { label: 'Détails du contrat', description: 'Type de contrat, secteur et alcool' },
    { label: 'Localisation et salaire', description: 'Ville, adresse et rémunération' },
    { label: 'Compétences et horaires', description: 'Compétences requises et horaires de travail' },
    { label: 'Finalisation', description: 'Vérifiez et publiez votre offre' }
  ];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  // Valeurs initiales du formulaire
  const initialValues = {
    title: '',
    description: '',
    contractType: '',
    sector: '',
    servesAlcohol: false,
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
      .oneOf(['CDD', 'Intérim', 'Extra', 'Saisonnier', 'Stage'], 'Type de contrat invalide'),
    sector: Yup.string().required('Le secteur est requis')
      .oneOf(['Bar', 'Restaurant', 'Restaurant collectif'], 'Secteur invalide'),
    servesAlcohol: Yup.boolean(),
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
        servesAlcohol: values.servesAlcohol,
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
      
      // Au lieu d'envoyer directement à l'API, on stocke les données et on ouvre la modal de paiement
      setJobDataToSubmit(jobData);
      setShowPaymentModal(true);
      
    } catch (err) {
      console.error('Erreur lors de la préparation de l\'offre:', err);
      
      // Gestion simplifiée des erreurs
      let errorMessage = 'Une erreur est survenue lors de la préparation de l\'offre.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Fonction appelée après un paiement réussi
  const handlePaymentSuccess = async (plan) => {
    try {
      if (!jobDataToSubmit) {
        throw new Error('Données de l\'offre non disponibles');
      }
      
      // Ajout des informations de forfait aux données de l'offre
      const jobDataWithSubscription = {
        ...jobDataToSubmit,
        subscription: {
          plan: plan.id,
          price: plan.price,
          duration: plan.duration,
          purchasedAt: new Date()
        }
      };
      
      // Envoi des données à l'API
      const response = await jobsAPI.createJob(jobDataWithSubscription);
      console.log('Réponse de l\'API après paiement:', response.data);
      
      if (!response.data) {
        throw new Error('Erreur lors de la création de l\'offre');
      }
      
      // Affichage d'un message de succès
      setSuccess(true);
      toast.success('Offre d\'emploi publiée avec succès!');
      
      // Réinitialiser le formulaire et revenir à l'étape 1
      setTimeout(() => {
        setActiveStep(0);
        navigate('/establishment/jobs');
      }, 2000);
      
    } catch (err) {
      console.error('Erreur lors de la création de l\'offre après paiement:', err);
      
      let errorMessage = 'Une erreur est survenue lors de la publication de l\'offre.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
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

  // Vérification de la validité des étapes
  const isStepValid = (step, values, errors) => {
    switch (step) {
      case 0: // Informations générales
        return values.title && values.description && !errors.title && !errors.description;
      case 1: // Détails du contrat
        return values.contractType && values.sector && !errors.contractType && !errors.sector;
      case 2: // Localisation et salaire
        return values.location.city && values.salary.amount && values.salary.period && 
               !errors.location?.city && !errors.salary?.amount && !errors.salary?.period;
      case 3: // Compétences et horaires
        return values.startDate && values.experienceLevel && !errors.startDate && !errors.experienceLevel;
      case 4: // Finalisation
        return true;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        {/* Modal de paiement */}
        <PaymentModal 
          open={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={handlePaymentSuccess}
          jobData={jobDataToSubmit}
        />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 3 }}>
            Créer une offre d'emploi
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
          
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepButton onClick={() => handleStepClick(index)}>
                    <StepLabel>{step.label}</StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.secondary" align="center">
              {steps[activeStep].description}
            </Typography>
          </Box>
          
          <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                resetForm
              }) => (
                <Form>
                  {/* Étape 1: Informations générales */}
                  {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
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
                          multiline
                          rows={4}
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.description && Boolean(errors.description)}
                          helperText={touched.description && errors.description}
                          margin="normal"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Étape 2: Détails du contrat */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                      Détails du contrat
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" error={touched.contractType && Boolean(errors.contractType)}>
                          <InputLabel id="contract-type-label">Type de contrat</InputLabel>
                          <Select
                            labelId="contract-type-label"
                            id="contractType"
                            name="contractType"
                            value={values.contractType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Type de contrat"
                          >
                            <MenuItem value="CDD">CDD</MenuItem>
                            <MenuItem value="Intérim">Intérim</MenuItem>
                            <MenuItem value="Extra">Extra</MenuItem>
                            <MenuItem value="Saisonnier">Saisonnier</MenuItem>
                            <MenuItem value="Stage">Stage</MenuItem>
                          </Select>
                          {touched.contractType && errors.contractType && (
                            <FormHelperText>{errors.contractType}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
                            <MenuItem value="Bar">Bar</MenuItem>
                            <MenuItem value="Restaurant">Restaurant</MenuItem>
                            <MenuItem value="Restaurant collectif">Restaurant collectif</MenuItem>
                          </Select>
                          {touched.sector && errors.sector && (
                            <FormHelperText>{errors.sector}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id="servesAlcohol"
                              name="servesAlcohol"
                              checked={values.servesAlcohol}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              color="primary"
                            />
                          }
                          label="Cet établissement sert de l'alcool"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Étape 3: Localisation et salaire */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                      Localisation et salaire
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="location.city"
                          name="location.city"
                          label="Ville"
                          value={values.location.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.location?.city && Boolean(errors.location?.city)}
                          helperText={touched.location?.city && errors.location?.city}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="location.address"
                          name="location.address"
                          label="Adresse"
                          value={values.location.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.location?.address && Boolean(errors.location?.address)}
                          helperText={touched.location?.address && errors.location?.address}
                          margin="normal"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="salary.amount"
                          name="salary.amount"
                          label="Montant du salaire"
                          type="number"
                          value={values.salary.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.salary?.amount && Boolean(errors.salary?.amount)}
                          helperText={touched.salary?.amount && errors.salary?.amount}
                          margin="normal"
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" error={touched.salary?.period && Boolean(errors.salary?.period)}>
                          <InputLabel id="salary-period-label">Période</InputLabel>
                          <Select
                            labelId="salary-period-label"
                            id="salary.period"
                            name="salary.period"
                            value={values.salary.period}
                            onChange={handleChange}
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
                  </Box>
                )}
                
                {/* Étape 4: Compétences et horaires */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                      Compétences et horaires
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Compétences requises
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TextField
                              fullWidth
                              id="newSkill"
                              name="newSkill"
                              label="Ajouter une compétence"
                              value={values.newSkill}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              sx={{ mr: 1 }}
                            />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleAddSkill(values, setFieldValue)}
                            >
                              Ajouter
                            </Button>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Période de la mission
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
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
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="endDate"
                          name="endDate"
                          label="Date de fin"
                          type="date"
                          value={values.endDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.endDate && Boolean(errors.endDate)}
                          helperText={touched.endDate && errors.endDate}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth margin="normal" error={touched.experienceLevel && Boolean(errors.experienceLevel)}>
                          <InputLabel id="experience-level-label">Niveau d'expérience</InputLabel>
                          <Select
                            labelId="experience-level-label"
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
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Horaires de travail
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="workingHours.start"
                          name="workingHours.start"
                          label="Heure de début"
                          type="time"
                          value={values.workingHours.start}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="workingHours.end"
                          name="workingHours.end"
                          label="Heure de fin"
                          type="time"
                          value={values.workingHours.end}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Jours de travail
                        </Typography>
                        <FormGroup row>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Lundi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Lundi']
                                    : values.workingDays.filter(day => day !== 'Lundi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Lundi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Mardi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Mardi']
                                    : values.workingDays.filter(day => day !== 'Mardi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Mardi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Mercredi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Mercredi']
                                    : values.workingDays.filter(day => day !== 'Mercredi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Mercredi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Jeudi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Jeudi']
                                    : values.workingDays.filter(day => day !== 'Jeudi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Jeudi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Vendredi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Vendredi']
                                    : values.workingDays.filter(day => day !== 'Vendredi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Vendredi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Samedi')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Samedi']
                                    : values.workingDays.filter(day => day !== 'Samedi');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Samedi"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.workingDays.includes('Dimanche')}
                                onChange={(e) => {
                                  const newWorkingDays = e.target.checked
                                    ? [...values.workingDays, 'Dimanche']
                                    : values.workingDays.filter(day => day !== 'Dimanche');
                                  setFieldValue('workingDays', newWorkingDays);
                                }}
                              />
                            }
                            label="Dimanche"
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Étape 5: Finalisation */}
                {activeStep === 4 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                      Finalisation
                    </Typography>
                    
                    <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.primary.light, 0.1), borderRadius: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Résumé de l'offre
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Titre:</Typography>
                          <Typography variant="body1" gutterBottom>{values.title}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Type de contrat:</Typography>
                          <Typography variant="body1" gutterBottom>{values.contractType}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Secteur:</Typography>
                          <Typography variant="body1" gutterBottom>{values.sector}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Ville:</Typography>
                          <Typography variant="body1" gutterBottom>{values.location.city}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Salaire:</Typography>
                          <Typography variant="body1" gutterBottom>
                            {values.salary.amount} {values.salary.currency} par {values.salary.period}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2">Date de début:</Typography>
                          <Typography variant="body1" gutterBottom>{values.startDate}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
                
                {/* Navigation entre les étapes */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    Précédent
                  </Button>
                  
                  <Box>
                    {activeStep < steps.length - 1 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={!isStepValid(activeStep, values, errors)}
                      >
                        Suivant
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Publier l\'offre'}
                      </Button>
                    )}
                  </Box>
                </Box>
                </Form>
              )}
            </Formik>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateJobPage;
