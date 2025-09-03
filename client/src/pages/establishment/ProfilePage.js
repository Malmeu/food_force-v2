import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, TextField, Button, Box, Avatar,
  Chip, Divider, Alert, CircularProgress, Card, CardContent, CardHeader,
  IconButton, Tab, Tabs, Tooltip, Stack, Badge, FormControlLabel, Switch
} from '@mui/material';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI as userAPI } from '../../utils/api';

// Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProfileSchema = Yup.object().shape({
  establishmentName: Yup.string().required('Le nom de l\'u00e9tablissement est requis'),
  email: Yup.string().email('Email invalide').required('L\'email est requis'),
  phone: Yup.string().required('Le numu00e9ro de tu00e9lu00e9phone est requis'),
  address: Yup.string().required('L\'adresse est requise'),
  city: Yup.string().required('La ville est requise'),
  description: Yup.string().max(1000, 'La description ne doit pas du00e9passer 1000 caractu00e8res'),
  website: Yup.string().url('URL invalide'),
  sectors: Yup.array().of(Yup.string()).min(1, 'Su00e9lectionnez au moins un secteur d\'activitu00e9'),
  contactPerson: Yup.string().required('Le nom de la personne de contact est requis'),
  contactPosition: Yup.string().required('La position de la personne de contact est requise'),
  foundedYear: Yup.number().integer('L\'annu00e9e doit u00eatre un nombre entier').min(1900, 'L\'annu00e9e doit u00eatre supu00e9rieure u00e0 1900').max(new Date().getFullYear(), 'L\'annu00e9e ne peut pas u00eatre dans le futur'),
  employeesCount: Yup.number().integer('Le nombre d\'employu00e9s doit u00eatre un nombre entier').min(1, 'Le nombre d\'employu00e9s doit u00eatre supu00e9rieur u00e0 0'),
  socialMedia: Yup.object().shape({
    facebook: Yup.string().url('URL Facebook invalide'),
    instagram: Yup.string().url('URL Instagram invalide'),
    linkedin: Yup.string().url('URL LinkedIn invalide'),
  }),
});

const ProfilePage = () => {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  
  // Gestion du changement d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Charger les donnu00e9es du profil au chargement du composant
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Si l'utilisateur est du00e9ju00e0 chargu00e9 dans le contexte d'authentification, utiliser ces donnu00e9es
        if (user) {
          console.log('Donnu00e9es utilisateur chargu00e9es depuis le contexte:', user);
          setUserData(user);
          
          // Ru00e9cupu00e9rer les images si elles existent
          if (user.establishmentProfile?.profileImage) {
            setProfileImage(user.establishmentProfile.profileImage);
          }
          if (user.establishmentProfile?.logo) {
            setLogoImage(user.establishmentProfile.logo);
          }
        } else {
          console.log('Aucune donnu00e9e utilisateur disponible');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des donnu00e9es du profil:', err);
        setError('Erreur lors du chargement des donnu00e9es du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // Valeurs initiales pour le formulaire
  const initialValues = {
    establishmentName: userData?.establishmentProfile?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address?.street || '',
    city: userData?.address?.city || '',
    description: userData?.establishmentProfile?.description || '',
    website: userData?.establishmentProfile?.website || '',
    sectors: userData?.establishmentProfile?.sector ? [userData.establishmentProfile.sector] : [],
    servesAlcohol: userData?.establishmentProfile?.servesAlcohol || false,
    contactPerson: userData?.establishmentProfile?.contactPerson ? 
      `${userData.establishmentProfile.contactPerson.firstName || ''} ${userData.establishmentProfile.contactPerson.lastName || ''}`.trim() : '',
    contactPosition: userData?.establishmentProfile?.contactPerson?.position || '',
    foundedYear: userData?.establishmentProfile?.foundedYear || '',
    employeesCount: userData?.establishmentProfile?.companySize || '',
    socialMedia: {
      facebook: userData?.establishmentProfile?.socialMedia?.facebook || '',
      instagram: userData?.establishmentProfile?.socialMedia?.instagram || '',
      linkedin: userData?.establishmentProfile?.socialMedia?.linkedin || '',
    },
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Début de la mise à jour du profil');
      
      // Vérifier l'authentification
      const token = localStorage.getItem('token');
      console.log('Token d\'authentification:', token ? `${token.substring(0, 15)}...` : 'Absent');
      
      if (!token) {
        const errMsg = 'Vous n\'êtes pas connecté. Veuillez vous connecter pour mettre à jour votre profil.';
        console.error(errMsg);
        setError(errMsg);
        setSubmitting(false);
        return;
      }
      
      // Préparer les données du profil en fonction de la structure attendue par le modèle MongoDB
      const profileData = {
        phone: values.phone,
        address: {
          street: values.address,
          city: values.city,
          postalCode: '',
          country: 'Maroc'
        },
        establishmentProfile: {
          name: values.establishmentName,
          description: values.description,
          website: values.website,
          sector: values.sectors[0] || 'Restaurant',  // Le modèle attend une chaîne, pas un tableau
          servesAlcohol: values.servesAlcohol, 
          companySize: values.employeesCount ? values.employeesCount.toString() : '',
          foundedYear: values.foundedYear ? parseInt(values.foundedYear) : null,
          socialMedia: {
            facebook: values.socialMedia.facebook || '',
            linkedin: values.socialMedia.linkedin || '',
            instagram: values.socialMedia.instagram || '',
            twitter: ''
          },
          contactPerson: {
            firstName: values.contactPerson ? values.contactPerson.split(' ')[0] || '' : '',
            lastName: values.contactPerson ? values.contactPerson.split(' ').slice(1).join(' ') || '' : '',
            position: values.contactPosition || '',
            email: values.email || '',
            phone: values.phone || ''
          },
          logo: logoImage || ''
        }
      };

      console.log('Données envoyées pour mise à jour du profil:', JSON.stringify(profileData, null, 2));

      // Appel API pour mettre à jour le profil
      try {
        console.log('Envoi de la requête de mise à jour du profil...');
        const response = await userAPI.updateProfile(profileData);
        console.log('Réponse de l\'API:', response);
        
        if (response && response.data && response.data.success) {
          console.log('Mise à jour du profil réussie !');
          setSuccess(true);
          setError('');
          setEditMode(false); // Désactiver le mode édition après sauvegarde réussie
          
          // Mettre à jour le contexte d'authentification et les données locales
          if (response.data.data) {
            updateAuthProfile(response.data.data);
            setUserData(response.data.data); // Mettre à jour les données locales
          }
          
          toast.success('Profil mis à jour avec succès');
        } else {
          throw new Error(response?.data?.message || 'Format de réponse inattendu');
        }
      } catch (apiError) {
        console.error('Erreur lors de la mise à jour du profil:', apiError);
        setError(apiError.message || 'Erreur lors de la mise à jour du profil');
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } catch (err) {
      console.error('Erreur globale:', err);
      setError(err.message || 'Une erreur inattendue s\'est produite');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Vu00e9rifier le type et la taille du fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non pris en charge. Utilisez JPG ou PNG.');
      return;
    }

    if (file.size > maxSize) {
      setError('L\'image est trop grande. Taille maximale: 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'profileImage');
    
    console.log('Envoi de la photo de profil...');
    try {
      // Utiliser une fonction d'upload générique
      const response = await fetch('/api/users/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log('Ru00e9ponse de l\'API:', data);
      if (data.success) {
        setProfileImage(data.imageUrl);
        setError('');
        toast.success('Photo de profil mise u00e0 jour avec succu00e8s');
      } else {
        throw new Error(data.message || 'Erreur lors du tu00e9lu00e9chargement de l\'image');
      }
    } catch (err) {
      console.error('Erreur lors du tu00e9lu00e9chargement de l\'image:', err);
      setError(err.message || 'Erreur lors du tu00e9lu00e9chargement de l\'image');
      toast.error('Erreur lors du tu00e9lu00e9chargement de l\'image');
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vu00e9rifier le type et la taille du fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setError('Type de fichier non pris en charge. Utilisez JPG ou PNG.');
      return;
    }

    if (file.size > maxSize) {
      setError('L\'image est trop grande. Taille maximale: 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', 'logoImage');
    
    console.log('Envoi du logo...');
    try {
      // Utiliser une fonction d'upload générique
      const response = await fetch('/api/users/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log('Ru00e9ponse de l\'API:', data);
      if (data.success) {
        setLogoImage(data.imageUrl);
        setError('');
        toast.success('Logo mis u00e0 jour avec succu00e8s');
      } else {
        throw new Error(data.message || 'Erreur lors du tu00e9lu00e9chargement du logo');
      }
    } catch (err) {
      console.error('Erreur lors du tu00e9lu00e9chargement du logo:', err);
      setError(err.message || 'Erreur lors du tu00e9lu00e9chargement du logo');
      toast.error('Erreur lors du tu00e9lu00e9chargement du logo');
    }
  };

  // Extraire le nom de l'u00e9tablissement pour l'affichage
  const establishmentName = userData?.establishmentProfile?.name || 'Établissement';

  // Activation/désactivation du mode édition
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Liste des secteurs d'activité correspondant exactement à l'enum dans le modèle User.js
  const sectors = [
    { value: 'Bar', label: 'Bar' },
    { value: 'Restaurant', label: 'Restaurant' },
    { value: 'Restaurant collectif', label: 'Restaurant collectif' },
  ];

  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* En-tête avec bannière et informations principales */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 0, 
              mb: 3, 
              borderRadius: 2, 
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Bannière avec option de modification */}
            <Box 
              sx={{ 
                height: 200, 
                bgcolor: 'primary.main', 
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)'
              }}
            >
              <Tooltip title="Modifier la photo de couverture">
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Logo et informations principales */}
            <Box sx={{ 
              display: 'flex', 
              px: 3, 
              pb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' }
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Modifier le logo">
                    <IconButton
                      component="label"
                      sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar 
                  src={logoImage || ''} 
                  alt={establishmentName}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    border: '4px solid white',
                    mt: '-60px',
                    bgcolor: 'secondary.main',
                    fontSize: '3rem'
                  }}
                >
                  {establishmentName.charAt(0)}
                </Avatar>
              </Badge>
              
              <Box sx={{ 
                ml: { xs: 0, sm: 3 }, 
                mt: { xs: 2, sm: 0 },
                textAlign: { xs: 'center', sm: 'left' },
                flexGrow: 1
              }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {establishmentName}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                  {userData?.establishmentProfile?.sector && (
                    <Chip 
                      icon={<WorkIcon />} 
                      label={sectors.find(s => s.value === userData.establishmentProfile.sector)?.label || userData.establishmentProfile.sector} 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                  {userData?.address?.city && (
                    <Chip 
                      icon={<LocationOnIcon />} 
                      label={userData.address.city} 
                      variant="outlined" 
                    />
                  )}
                  {userData?.establishmentProfile?.foundedYear && (
                    <Chip 
                      label={`Fondé en ${userData.establishmentProfile.foundedYear}`} 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </Box>
              
              <Button
                variant="contained"
                color={editMode ? "error" : "primary"}
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                onClick={toggleEditMode}
                sx={{ alignSelf: { xs: 'center', sm: 'flex-start' }, mt: { xs: 2, sm: 0 } }}
              >
                {editMode ? "Annuler" : "Modifier le profil"}
              </Button>
            </Box>
          </Paper>
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Votre profil a été mis à jour avec succès.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Navigation par onglets */}
          <Paper sx={{ borderRadius: 2, mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              aria-label="onglets du profil"
            >
              <Tab icon={<BusinessIcon />} label="Informations générales" />
              <Tab icon={<PersonIcon />} label="Contact" />
              <Tab icon={<DescriptionIcon />} label="Description" />
              <Tab icon={<LanguageIcon />} label="Réseaux sociaux" />
            </Tabs>
          </Paper>
          
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form>
                {/* Contenu des onglets */}
                <Box sx={{ mt: 2 }}>
                  {/* Onglet 1: Informations générales */}
                  {activeTab === 0 && (
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon sx={{ mr: 1 }} /> Informations de l'établissement
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              
                              <TextField
                                fullWidth
                                id="establishmentName"
                                name="establishmentName"
                                label="Nom de l'établissement"
                                value={values.establishmentName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.establishmentName && Boolean(errors.establishmentName)}
                                helperText={touched.establishmentName && errors.establishmentName}
                                margin="normal"
                                disabled={!editMode}
                                InputProps={{
                                  startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                Secteur d'activité
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                                {sectors.map((sector) => (
                                  <Chip
                                    key={sector.value}
                                    label={sector.label}
                                    onClick={() => {
                                      if (!editMode) return;
                                      const currentSectors = [...values.sectors];
                                      if (currentSectors.includes(sector.value)) {
                                        setFieldValue(
                                          'sectors',
                                          currentSectors.filter((s) => s !== sector.value)
                                        );
                                      } else {
                                        setFieldValue('sectors', [...currentSectors, sector.value]);
                                      }
                                    }}
                                    color={values.sectors.includes(sector.value) ? 'primary' : 'default'}
                                    variant={values.sectors.includes(sector.value) ? 'filled' : 'outlined'}
                                    disabled={!editMode}
                                  />
                                ))}
                              </Box>
                              
                              {touched.sectors && errors.sectors && (
                                <Typography color="error" variant="caption">
                                  {errors.sectors}
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ mt: 2 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={values.servesAlcohol}
                                    onChange={(e) => setFieldValue('servesAlcohol', e.target.checked)}
                                    name="servesAlcohol"
                                    color="primary"
                                    disabled={!editMode}
                                  />
                                }
                                label="Cet établissement sert de l'alcool"
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOnIcon sx={{ mr: 1 }} /> Localisation
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              
                              <TextField
                                fullWidth
                                id="address"
                                name="address"
                                label="Adresse"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.address && Boolean(errors.address)}
                                helperText={touched.address && errors.address}
                                margin="normal"
                                disabled={!editMode}
                                InputProps={{
                                  startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />
                                }}
                              />
                              
                              <TextField
                                fullWidth
                                id="city"
                                name="city"
                                label="Ville"
                                value={values.city}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.city && Boolean(errors.city)}
                                helperText={touched.city && errors.city}
                                margin="normal"
                                disabled={!editMode}
                              />
                            </Box>
                            
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <WorkIcon sx={{ mr: 1 }} /> Détails de l'entreprise
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    id="foundedYear"
                                    name="foundedYear"
                                    label="Année de création"
                                    type="number"
                                    value={values.foundedYear}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.foundedYear && Boolean(errors.foundedYear)}
                                    helperText={touched.foundedYear && errors.foundedYear}
                                    margin="normal"
                                    disabled={!editMode}
                                  />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    id="employeesCount"
                                    name="employeesCount"
                                    label="Nombre d'employés"
                                    type="number"
                                    value={values.employeesCount}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.employeesCount && Boolean(errors.employeesCount)}
                                    helperText={touched.employeesCount && errors.employeesCount}
                                    margin="normal"
                                    disabled={!editMode}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                  {/* Onglet 2: Contact */}
                  {activeTab === 1 && (
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} /> Informations de contact
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              
                              <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                margin="normal"
                                disabled={!editMode}
                                InputProps={{
                                  startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                                }}
                              />
                              
                              <TextField
                                fullWidth
                                id="phone"
                                name="phone"
                                label="Téléphone"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.phone && Boolean(errors.phone)}
                                helperText={touched.phone && errors.phone}
                                margin="normal"
                                disabled={!editMode}
                                InputProps={{
                                  startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                                }}
                              />
                              
                              <TextField
                                fullWidth
                                id="website"
                                name="website"
                                label="Site web"
                                value={values.website}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.website && Boolean(errors.website)}
                                helperText={touched.website && errors.website}
                                margin="normal"
                                disabled={!editMode}
                                InputProps={{
                                  startAdornment: <LanguageIcon color="action" sx={{ mr: 1 }} />
                                }}
                              />
                            </Box>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <PersonIcon sx={{ mr: 1 }} /> Personne de contact
                              </Typography>
                              <Divider sx={{ mb: 2 }} />
                              
                              <TextField
                                fullWidth
                                id="contactPerson"
                                name="contactPerson"
                                label="Nom et prénom"
                                value={values.contactPerson}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.contactPerson && Boolean(errors.contactPerson)}
                                helperText={touched.contactPerson && errors.contactPerson}
                                margin="normal"
                                disabled={!editMode}
                              />
                              
                              <TextField
                                fullWidth
                                id="contactPosition"
                                name="contactPosition"
                                label="Poste occupé"
                                value={values.contactPosition}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.contactPosition && Boolean(errors.contactPosition)}
                                helperText={touched.contactPosition && errors.contactPosition}
                                margin="normal"
                                disabled={!editMode}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Onglet 3: Description */}
                  {activeTab === 2 && (
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <DescriptionIcon sx={{ mr: 1 }} /> Description de l'établissement
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <TextField
                          fullWidth
                          id="description"
                          name="description"
                          label="Description détaillée"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.description && Boolean(errors.description)}
                          helperText={touched.description && errors.description}
                          margin="normal"
                          multiline
                          rows={8}
                          disabled={!editMode}
                          placeholder="Décrivez votre établissement, son histoire, ses valeurs et sa mission..."
                        />
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Onglet 4: Réseaux sociaux */}
                  {activeTab === 3 && (
                    <Card elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ mr: 1 }} /> Réseaux sociaux
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              id="socialMedia.facebook"
                              name="socialMedia.facebook"
                              label="Facebook"
                              value={values.socialMedia.facebook}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.socialMedia?.facebook && Boolean(errors.socialMedia?.facebook)}
                              helperText={touched.socialMedia?.facebook && errors.socialMedia?.facebook}
                              margin="normal"
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <FacebookIcon color="action" sx={{ mr: 1 }} />
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              id="socialMedia.instagram"
                              name="socialMedia.instagram"
                              label="Instagram"
                              value={values.socialMedia.instagram}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.socialMedia?.instagram && Boolean(errors.socialMedia?.instagram)}
                              helperText={touched.socialMedia?.instagram && errors.socialMedia?.instagram}
                              margin="normal"
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <InstagramIcon color="action" sx={{ mr: 1 }} />
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              id="socialMedia.linkedin"
                              name="socialMedia.linkedin"
                              label="LinkedIn"
                              value={values.socialMedia.linkedin}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.socialMedia?.linkedin && Boolean(errors.socialMedia?.linkedin)}
                              helperText={touched.socialMedia?.linkedin && errors.socialMedia?.linkedin}
                              margin="normal"
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: <LinkedInIcon color="action" sx={{ mr: 1 }} />
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Bouton de sauvegarde */}
                  {editMode && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={<SaveIcon />}
                      >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Container>
  );
};

export default ProfilePage;
