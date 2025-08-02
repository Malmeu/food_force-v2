import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Box, Avatar, Chip, Divider, Alert, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../utils/api';
import { sectors } from '../../utils/config';

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
      console.log('Du00e9but de la mise u00e0 jour du profil');
      
      // Vu00e9rifier l'authentification
      const token = localStorage.getItem('token');
      console.log('Token d\'authentification:', token ? `${token.substring(0, 15)}...` : 'Absent');
      
      if (!token) {
        const errMsg = 'Vous n\'u00eates pas connectu00e9. Veuillez vous connecter pour mettre u00e0 jour votre profil.';
        console.error(errMsg);
        setError(errMsg);
        setSubmitting(false);
        return;
      }
      
      // Pru00e9parer les donnu00e9es du profil en fonction de la structure attendue par le modu00e8le MongoDB
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
          sector: values.sectors[0] || '',  // Le modu00e8le attend une chau00eene, pas un tableau
          companySize: values.employeesCount.toString(),
          foundedYear: parseInt(values.foundedYear),
          socialMedia: {
            facebook: values.socialMedia.facebook || '',
            linkedin: values.socialMedia.linkedin || '',
            instagram: values.socialMedia.instagram || '',
            twitter: ''
          },
          contactPerson: {
            firstName: values.contactPerson.split(' ')[0] || '',
            lastName: values.contactPerson.split(' ').slice(1).join(' ') || '',
            position: values.contactPosition || '',
            email: values.email || '',
            phone: values.phone || ''
          },
          logo: logoImage || ''
        }
      };

      console.log('Donnu00e9es envoyu00e9es pour mise u00e0 jour du profil:', JSON.stringify(profileData, null, 2));

      // Appel API pour mettre u00e0 jour le profil avec gestion d'erreur amu00e9lioru00e9e
      try {
        console.log('Envoi de la requ00eate de mise u00e0 jour du profil...');
        const response = await userAPI.updateProfile(profileData);
        console.log('Ru00e9ponse de l\'API:', response);
        
        if (response && response.data && response.data.success) {
          console.log('Mise u00e0 jour du profil ru00e9ussie !');
          setSuccess(true);
          setError('');
          
          // Mettre u00e0 jour le contexte d'authentification
          if (response.data.data) {
            updateAuthProfile(response.data.data);
          }
          
          toast.success('Profil mis u00e0 jour avec succu00e8s');
        } else {
          throw new Error(response?.data?.message || 'Format de ru00e9ponse inattendu');
        }
      } catch (apiError) {
        console.error('Erreur lors de la mise u00e0 jour du profil:', apiError);
        setError(apiError.message || 'Erreur lors de la mise u00e0 jour du profil');
        toast.error('Erreur lors de la mise u00e0 jour du profil');
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
      const response = await userAPI.uploadFile(formData);
      console.log('Ru00e9ponse de l\'API:', response.data);
      if (response.data.success) {
        setProfileImage(response.data.imageUrl);
        setError('');
        toast.success('Photo de profil mise u00e0 jour avec succu00e8s');
      } else {
        throw new Error(response.data.message || 'Erreur lors du tu00e9lu00e9chargement de l\'image');
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
      const response = await userAPI.uploadFile(formData);
      console.log('Ru00e9ponse de l\'API:', response.data);
      if (response.data.success) {
        setLogoImage(response.data.imageUrl);
        setError('');
        toast.success('Logo mis u00e0 jour avec succu00e8s');
      } else {
        throw new Error(response.data.message || 'Erreur lors du tu00e9lu00e9chargement du logo');
      }
    } catch (err) {
      console.error('Erreur lors du tu00e9lu00e9chargement du logo:', err);
      setError(err.message || 'Erreur lors du tu00e9lu00e9chargement du logo');
      toast.error('Erreur lors du tu00e9lu00e9chargement du logo');
    }
  };

  // Extraire le nom de l'u00e9tablissement pour l'affichage
  const establishmentName = userData?.establishmentProfile?.name || 'u00c9tablissement';
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Titre de la page avec le nom de l'u00e9tablissement */}
          <Typography variant="h4" component="h1" gutterBottom>
            Profil de {establishmentName}
          </Typography>
          
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Votre profil a u00e9tu00e9 mis u00e0 jour avec succu00e8s.
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={ProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Colonne de gauche */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Images
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Photo de profil
                        </Typography>
                        
                        <Avatar 
                          src={profileImage} 
                          alt={values.establishmentName}
                          sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                        >
                          Changer la photo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                          />
                        </Button>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Logo de l'u00e9tablissement
                        </Typography>
                        
                        <Avatar 
                          src={logoImage} 
                          alt="Logo"
                          sx={{ width: 100, height: 100, mb: 2 }}
                        />
                        
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<CloudUploadIcon />}
                        >
                          Changer le logo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleLogoUpload}
                          />
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Colonne de droite */}
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Informations gu00e9nu00e9rales
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id="establishmentName"
                            name="establishmentName"
                            label="Nom de l'u00e9tablissement"
                            value={values.establishmentName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.establishmentName && Boolean(errors.establishmentName)}
                            helperText={touched.establishmentName && errors.establishmentName}
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
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
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label="Tu00e9lu00e9phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
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
                            id="description"
                            name="description"
                            label="Description de l'u00e9tablissement"
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
                        
                        <Grid item xs={12}>
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
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                    
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Secteurs d'activitu00e9
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                        {sectors.map((sector) => (
                          <Chip
                            key={sector.value}
                            label={sector.label}
                            onClick={() => {
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
                          />
                        ))}
                      </Box>
                      
                      {touched.sectors && errors.sectors && (
                        <Typography color="error" variant="caption">
                          {errors.sectors}
                        </Typography>
                      )}
                    </Paper>
                    
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Informations du00e9taillu00e9es
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="contactPerson"
                            name="contactPerson"
                            label="Personne de contact"
                            value={values.contactPerson}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.contactPerson && Boolean(errors.contactPerson)}
                            helperText={touched.contactPerson && errors.contactPerson}
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="contactPosition"
                            name="contactPosition"
                            label="Poste de la personne de contact"
                            value={values.contactPosition}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.contactPosition && Boolean(errors.contactPosition)}
                            helperText={touched.contactPosition && errors.contactPosition}
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="foundedYear"
                            name="foundedYear"
                            label="Annu00e9e de cru00e9ation"
                            type="number"
                            value={values.foundedYear}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.foundedYear && Boolean(errors.foundedYear)}
                            helperText={touched.foundedYear && errors.foundedYear}
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            id="employeesCount"
                            name="employeesCount"
                            label="Nombre d'employu00e9s"
                            type="number"
                            value={values.employeesCount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.employeesCount && Boolean(errors.employeesCount)}
                            helperText={touched.employeesCount && errors.employeesCount}
                            margin="normal"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                    
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Ru00e9seaux sociaux
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
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
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
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
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
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
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                      >
                        {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </>
      )}
    </Container>
  );
};

export default ProfilePage;
