import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EstablishmentPublicProfilePage = () => {
  const { id } = useParams();
  const [establishment, setEstablishment] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstablishmentProfile = async () => {
      setLoading(true);
      try {
        console.log('Récupération du profil de l\'établissement avec ID:', id);
        const response = await axios.get(`/api/users/establishments/${id}`);
        console.log('Réponse API:', response.data);
        
        if (response.data.success) {
          setEstablishment(response.data.data);
          setJobs(response.data.jobs || []);
          console.log('Profil établissement chargé:', response.data.data);
          console.log('Offres d\'emploi chargées:', response.data.jobs);
        } else {
          throw new Error('Erreur lors de la récupération du profil');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        setError(err.response?.data?.message || 'Impossible de charger le profil de l\'établissement');
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishmentProfile();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement du profil de l'établissement...
        </Typography>
      </Container>
    );
  }

  if (error || !establishment) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Établissement non trouvé'}
        </Typography>
        <Button
          component={Link}
          to="/jobs"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Retour aux offres d'emploi
        </Button>
      </Container>
    );
  }

  // Extraire les informations de l'établissement
  const {
    establishmentProfile,
    email,
    phone,
    address,
  } = establishment;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Retour aux offres d'emploi
      </Button>

      <Grid container spacing={4}>
        {/* Profil principal */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={establishmentProfile?.logo}
                  alt={establishmentProfile?.name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                >
                  <BusinessIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {establishmentProfile?.name || 'Établissement'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {establishmentProfile?.sector || 'Secteur non spécifié'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                À propos de nous
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {establishmentProfile?.description || 'Aucune description disponible.'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Informations de contact
              </Typography>
              <List>
                {address && (
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Adresse"
                      secondary={`${address.street || ''}, ${address.city || ''}, ${address.postalCode || ''}, ${address.country || 'Maroc'}`}
                    />
                  </ListItem>
                )}
                {phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Téléphone"
                      secondary={phone}
                    />
                  </ListItem>
                )}
                {email && (
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={email}
                    />
                  </ListItem>
                )}
                {establishmentProfile?.website && (
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Site web"
                      secondary={
                        <a href={establishmentProfile.website} target="_blank" rel="noopener noreferrer">
                          {establishmentProfile.website}
                        </a>
                      }
                    />
                  </ListItem>
                )}
              </List>

              {establishmentProfile?.contactPerson && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Personne de contact
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {`${establishmentProfile.contactPerson.firstName || ''} ${establishmentProfile.contactPerson.lastName || ''}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {establishmentProfile.contactPerson.position || 'Poste non spécifié'}
                      </Typography>
                    </Box>
                  </Box>
                  <List dense>
                    {establishmentProfile.contactPerson.email && (
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={establishmentProfile.contactPerson.email} />
                      </ListItem>
                    )}
                    {establishmentProfile.contactPerson.phone && (
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={establishmentProfile.contactPerson.phone} />
                      </ListItem>
                    )}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Informations supplémentaires et offres d'emploi */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations supplémentaires
            </Typography>
            <List dense>
              {establishmentProfile?.foundedYear && (
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Année de fondation"
                    secondary={establishmentProfile.foundedYear}
                  />
                </ListItem>
              )}
              {establishmentProfile?.companySize && (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Taille de l'entreprise"
                    secondary={`${establishmentProfile.companySize} employés`}
                  />
                </ListItem>
              )}
            </List>

            {establishmentProfile?.socialMedia && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Réseaux sociaux
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {establishmentProfile.socialMedia.facebook && (
                    <Button
                      href={establishmentProfile.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<FacebookIcon />}
                    >
                      Facebook
                    </Button>
                  )}
                  {establishmentProfile.socialMedia.linkedin && (
                    <Button
                      href={establishmentProfile.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<LinkedInIcon />}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {establishmentProfile.socialMedia.instagram && (
                    <Button
                      href={establishmentProfile.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                      startIcon={<InstagramIcon />}
                    >
                      Instagram
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Paper>

          {jobs.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Offres d'emploi actuelles
              </Typography>
              <List>
                {jobs.map((job) => (
                  <ListItem key={job._id} alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Link to={`/jobs/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="subtitle1" color="primary">
                            {job.title}
                          </Typography>
                        </Link>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {job.location?.city || 'Lieu non spécifié'}
                          </Typography>
                          <Box sx={{ display: 'flex', mt: 1 }}>
                            <Chip
                              label={job.contractType}
                              size="small"
                              color={job.contractType === 'CDI' ? 'success' : 'primary'}
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={job.sector}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                to="/jobs"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Voir toutes les offres
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default EstablishmentPublicProfilePage;
