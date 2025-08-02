import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Box, Avatar, Chip, Divider, Alert, CircularProgress } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, authAPI } from '../../utils/api';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('Tentative de récupération du profil pour l\'utilisateur:', user);
        
        if (!user || !user.id) {
          console.error('Aucun utilisateur ou ID utilisateur non disponible');
          throw new Error('Utilisateur non authentifié');
        }
        
        // Récupérer les données de l'utilisateur courant
        const response = await authAPI.getCurrentUser();
        
        console.log('Réponse du profil reçue:', response);
        
        if (response && response.data) {
          // Extraire les données du profil de la réponse
          const profileData = response.data.data || response.data;
          console.log('Données du profil extraites:', profileData);
          
          // Vérifier que les données du profil candidat existent
          if (!profileData.candidateProfile) {
            console.error('Profil candidat manquant dans les données:', profileData);
            
            // Si le profil candidat n'existe pas, utiliser directement les données de l'utilisateur
            // Cela permet d'afficher les informations même si elles ne sont pas dans un sous-objet candidateProfile
            const displayData = {
              ...profileData,
              firstName: profileData.firstName || '',
              lastName: profileData.lastName || '',
              bio: profileData.bio || '',
              education: profileData.education || '',
              experienceLevel: profileData.experienceLevel || '',
              skills: profileData.skills || [],
              preferredSectors: profileData.preferredSectors || []
            };
            
            console.log('Données formatées pour l\'affichage (sans candidateProfile):', displayData);
            setProfileData(displayData);
            setError('');
            setLoading(false);
            return;
          }
          
          // Préparer les données pour l'affichage en combinant les deux niveaux
          const displayData = {
            ...profileData,
            // Ajouter les champs du profil candidat au niveau supérieur pour faciliter l'accès
            ...(profileData.candidateProfile || {})
          };
          
          console.log('Données formatées pour l\'affichage:', displayData);
          setProfileData(displayData);
          setError('');
        } else {
          throw new Error('Format de réponse inattendu');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Impossible de charger votre profil. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setUploadError('');
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log('Données du formulaire à envoyer:', values);
      
      // Structure simplifiée pour la mise à jour du profil
      const profileData = {
        // Champs communs
        phone: values.phone,
        address: {
          street: values.address,
          city: values.city,
          country: 'Maroc'
        },
        
        // Champs du profil candidat directement au premier niveau
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio,
        education: values.education,
        experienceLevel: values.experienceLevel,
        skills: values.skills || [],
        preferredSectors: values.preferredSectors || []
      };
      
      console.log('Données structurées à envoyer:', profileData);
      
      const response = await userAPI.updateProfile(profileData);
      console.log('Réponse de mise à jour du profil:', response);
      
      if (response && response.data && (response.data.success || response.status === 200)) {
        setSuccess(true);
        setError('');
        setEditMode(false);
        
        // Mettre à jour le contexte d'authentification
        if (updateProfile && typeof updateProfile === 'function') {
          const userData = response.data.data || response.data;
          updateProfile(userData);
        }
        
        // Rafraîchir les données du profil
        const updatedProfileResponse = await authAPI.getCurrentUser();
        if (updatedProfileResponse && updatedProfileResponse.data) {
          const updatedProfileData = updatedProfileResponse.data.data || updatedProfileResponse.data;
          const displayData = {
            ...updatedProfileData,
            ...(updatedProfileData.candidateProfile || {})
          };
          setProfileData(displayData);
        }
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error('Échec de la mise à jour du profil');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError('Impossible de mettre à jour votre profil. Veuillez réessayer plus tard.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      setUploadError('Veuillez sélectionner un fichier');
      return;
    }
    
    try {
      setUploading(true);
      setUploadError('');
      
      const formData = new FormData();
      formData.append('cv', uploadedFile);
      
      const response = await userAPI.uploadCV(formData);
      console.log('Réponse du téléversement du CV:', response);
      
      if (response && response.data && (response.data.success || response.status === 200)) {
        setUploadSuccess(true);
        setUploadError('');
        
        // Rafraîchir les données du profil
        const updatedProfileResponse = await authAPI.getCurrentUser();
        if (updatedProfileResponse && updatedProfileResponse.data) {
          const updatedProfileData = updatedProfileResponse.data.data || updatedProfileResponse.data;
          const displayData = {
            ...updatedProfileData,
            ...(updatedProfileData.candidateProfile || {})
          };
          setProfileData(displayData);
        }
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setUploadSuccess(false);
          setUploadedFileName('');
          setUploadedFile(null);
        }, 3000);
      } else {
        throw new Error('Échec du téléversement du CV');
      }
    } catch (err) {
      console.error('Erreur lors du téléversement du CV:', err);
      setUploadError('Impossible de téléverser votre CV. Veuillez réessayer plus tard.');
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Le prénom est requis'),
    lastName: Yup.string().required('Le nom est requis'),
    phone: Yup.string().required('Le numéro de téléphone est requis'),
    city: Yup.string().required('La ville est requise'),
    address: Yup.string(),
    bio: Yup.string(),
    education: Yup.string(),
    experienceLevel: Yup.string().required('Le niveau d\'expérience est requis'),
    skills: Yup.array().of(Yup.string()),
    preferredSectors: Yup.array().of(Yup.string()),
  });

  // Extraire le nom complet du candidat pour l'affichage
  const fullName = profileData ? 
    `${profileData.firstName || profileData.candidateProfile?.firstName || ''} ${profileData.lastName || profileData.candidateProfile?.lastName || ''}`.trim() || 'Candidat' : 
    'Candidat';
    
  // Ajouter des logs pour déboguer
  console.log('Nom complet extrait:', fullName);
  console.log('Données du profil disponibles:', profileData);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !profileData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon profil
      </Typography>

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

      <Grid container spacing={4}>
        {/* En-tête avec le nom complet */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profil de {fullName}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profileData?.profileImage || ''}
                alt={`${profileData?.firstName} ${profileData?.lastName}`}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                {profileData?.firstName || profileData?.candidateProfile?.firstName} {profileData?.lastName || profileData?.candidateProfile?.lastName}
              </Typography>
              
              {(profileData?.experienceLevel || profileData?.candidateProfile?.experienceLevel) && (
                <Chip 
                  label={
                    (profileData?.experienceLevel || profileData?.candidateProfile?.experienceLevel) === 'entry' ? 'Débutant' :
                    (profileData?.experienceLevel || profileData?.candidateProfile?.experienceLevel) === 'intermediate' ? 'Intermédiaire' :
                    (profileData?.experienceLevel || profileData?.candidateProfile?.experienceLevel) === 'experienced' ? 'Expérimenté' :
                    'Expert'
                  }
                  color="primary"
                  sx={{ mb: 2 }}
                />
              )}
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informations de contact
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">
                    {profileData?.email}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1 }}>
                    Téléphone:
                  </Typography>
                  <Typography variant="body2">
                    {profileData?.phone}
                  </Typography>
                </Box>
                
                {(profileData?.city || profileData?.address?.city) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {profileData?.city || profileData?.address?.city}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ width: '100%', mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  CV / Resume
                </Typography>
                
                {profileData?.cv ? (
                  <Box>
                    <Button 
                      variant="outlined" 
                      component="a"
                      href={profileData.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Voir mon CV
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun CV téléversé
                  </Typography>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    Téléverser un CV
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </Button>
                  
                  {uploadedFileName && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Fichier sélectionné: {uploadedFileName}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={uploading}
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        {uploading ? <CircularProgress size={24} /> : 'Enregistrer'}
                      </Button>
                    </Box>
                  )}
                  
                  {uploadError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {uploadError}
                    </Alert>
                  )}
                  
                  {uploadSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      CV téléversé avec succès
                    </Alert>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
                Détails du profil
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Annuler' : 'Modifier'}
              </Button>
            </Box>
            
            {editMode ? (
              <Formik
                initialValues={{
                  firstName: profileData?.firstName || profileData?.candidateProfile?.firstName || '',
                  lastName: profileData?.lastName || profileData?.candidateProfile?.lastName || '',
                  phone: profileData?.phone || '',
                  address: profileData?.address?.street || '',
                  city: profileData?.address?.city || profileData?.city || '',
                  bio: profileData?.bio || profileData?.candidateProfile?.bio || '',
                  education: profileData?.education || profileData?.candidateProfile?.education || '',
                  experienceLevel: profileData?.experienceLevel || profileData?.candidateProfile?.experienceLevel || 'entry',
                  skills: profileData?.skills || profileData?.candidateProfile?.skills || [],
                  preferredSectors: profileData?.preferredSectors || profileData?.candidateProfile?.preferredSectors || []
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                  <Form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="firstName"
                          name="firstName"
                          label="Prénom"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="lastName"
                          name="lastName"
                          label="Nom"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
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
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
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
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
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
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="bio"
                          name="bio"
                          label="Biographie"
                          value={values.bio}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.bio && Boolean(errors.bio)}
                          helperText={touched.bio && errors.bio}
                          margin="normal"
                          multiline
                          rows={4}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="education"
                          name="education"
                          label="Formation"
                          value={values.education}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.education && Boolean(errors.education)}
                          helperText={touched.education && errors.education}
                          margin="normal"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          id="experienceLevel"
                          name="experienceLevel"
                          label="Niveau d'expérience"
                          value={values.experienceLevel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.experienceLevel && Boolean(errors.experienceLevel)}
                          helperText={touched.experienceLevel && errors.experienceLevel}
                          margin="normal"
                          SelectProps={{
                            native: true,
                          }}
                        >
                          <option value="entry">Débutant</option>
                          <option value="intermediate">Intermédiaire</option>
                          <option value="experienced">Expérimenté</option>
                          <option value="expert">Expert</option>
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                        >
                          {isSubmitting ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            ) : (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    À propos de moi
                  </Typography>
                  <Typography variant="body1">
                    {profileData?.bio || profileData?.candidateProfile?.bio || 'Aucune biographie renseignée'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <SchoolIcon sx={{ mr: 1 }} /> Formation
                  </Typography>
                  <Typography variant="body1">
                    {profileData?.education || 'Aucune formation renseignée'}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1 }} /> Compétences
                  </Typography>
                  
                  {(profileData?.skills || profileData?.candidateProfile?.skills) && (profileData?.skills?.length > 0 || profileData?.candidateProfile?.skills?.length > 0) ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(profileData?.skills || profileData?.candidateProfile?.skills || []).map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucune compétence renseignée
                    </Typography>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Secteurs préférés
                  </Typography>
                  
                  {(profileData?.preferredSectors || profileData?.candidateProfile?.preferredSectors) && (profileData?.preferredSectors?.length > 0 || profileData?.candidateProfile?.preferredSectors?.length > 0) ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {(profileData?.preferredSectors || profileData?.candidateProfile?.preferredSectors || []).map((sector, index) => (
                        <Chip key={index} label={sector} color="secondary" variant="outlined" size="small" />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun secteur préféré renseigné
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
