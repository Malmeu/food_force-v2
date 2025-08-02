import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jobAPI, applicationsAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        
        // Récupérer les détails de l'offre d'emploi
        const response = await jobAPI.getJob(id);
        console.log('Réponse API détails offre:', response);
        
        if (response && response.data) {
          const jobData = response.data.data || response.data;
          setJob(jobData);
          
          // Vérifier si l'utilisateur a déjà postulé à cette offre
          if (user) {
            try {
              // Forcer l'utilisation de l'URL de l'API Render en production
              const baseUrl = 'https://food-force-api.onrender.com';
              const url = new URL('/api/applications/candidate', baseUrl);
              console.log('URL de vérification des candidatures:', url.toString());
              
              const token = localStorage.getItem('token');
              const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
              if (token) headers['Authorization'] = `Bearer ${token}`;
              
              const response = await fetch(url.toString(), {
                method: 'GET',
                headers
              });
              
              if (!response.ok) {
                const textResponse = await response.text();
                console.error(`Erreur HTTP ${response.status}:`, textResponse);
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
              }
              
              const data = await response.json();
              console.log('Réponse API candidatures:', data);
              
              const applications = data.data || data;
              const existingApplication = applications.find(app => app.job?._id === id || app.job === id);
              if (existingApplication) {
                setHasApplied(true);
                setApplicationStatus(existingApplication.status);
              }
            } catch (err) {
              console.error('Erreur lors de la vérification des candidatures:', err);
            }
          }
        } else {
          throw new Error('Format de réponse inattendu');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'offre:', err);
        setError('Impossible de charger les détails de l\'offre. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      
      // Forcer l'utilisation de l'URL de l'API Render en production
      const baseUrl = 'https://food-force-api.onrender.com';
      console.log('Utilisation de l\'URL API Render:', baseUrl);
      
      const url = new URL(`/api/applications`, baseUrl);
      console.log('URL de soumission de candidature:', url.toString());
      
      const token = localStorage.getItem('token');
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          job: id,
          coverLetter: coverLetter
        })
      });
      
      if (!response.ok) {
        const textResponse = await response.text();
        console.error(`Erreur HTTP ${response.status}:`, textResponse);
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Réponse API candidature:', data);
      
      // Envoyer une notification à l'établissement
      try {
        const notificationUrl = new URL('/api/notifications', baseUrl);
        const employerId = job.employer?._id;
        
        if (employerId) {
          console.log('Envoi d\'une notification à l\'employeur:', employerId);
          
          await fetch(notificationUrl.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify({
              recipient: employerId,
              type: 'new_application',
              content: `Nouvelle candidature reçue pour l'offre: ${job.title}`,
              relatedResource: id
            })
          });
          console.log('Notification envoyée à l\'employeur');
        }
      } catch (notifErr) {
        console.error('Erreur lors de l\'envoi de la notification à l\'employeur:', notifErr);
        // Ne pas bloquer le processus si l'envoi de notification échoue
      }
      
      toast.success('Votre candidature a été envoyée avec succès!');
      setHasApplied(true);
      setApplicationStatus('En attente');
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la candidature:', err);
      toast.error(err.message || 'Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des détails de l'offre...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Retour
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Offre d'emploi non trouvée
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Retour
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Retour
      </Button>
      
      <Grid container spacing={4}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {job.title}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    icon={<WorkIcon />} 
                    label={job.contractType} 
                    variant="outlined" 
                    color="primary" 
                  />
                  <Chip 
                    icon={<LocationOnIcon />} 
                    label={`${job.location?.city || 'Non spécifié'}`} 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={`${job.salary?.amount || ''} ${job.salary?.currency || 'MAD'}/${job.salary?.period || 'mois'}`} 
                    variant="outlined" 
                    color="secondary" 
                  />
                </Box>
              </Box>
              
              <Box>
                {hasApplied ? (
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label={`Candidature ${applicationStatus}`} 
                      color={applicationStatus === 'Acceptée' ? 'success' : applicationStatus === 'Refusée' ? 'error' : 'warning'} 
                      variant="filled" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  ) : (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      onClick={handleOpenDialog}
                    >
                      Postuler maintenant
                    </Button>
                  )}
                </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Description du poste
            </Typography>
            <Typography variant="body1" paragraph style={{ whiteSpace: 'pre-line' }}>
              {job.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
              Compétences requises
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {job.requiredSkills && job.requiredSkills.length > 0 ? (
                job.requiredSkills.map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucune compétence spécifique mentionnée
                </Typography>
              )}
            </Box>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Détails du contrat
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Type de contrat" 
                          secondary={job.contractType || 'Non spécifié'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CalendarTodayIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Date de début" 
                          secondary={formatDate(job.startDate)} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><AccessTimeIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Horaires de travail" 
                          secondary={`${job.workingHours?.start || ''} - ${job.workingHours?.end || ''}`} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Prérequis
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Expérience requise" 
                          secondary={job.experienceLevel || 'Non spécifié'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Niveau d'études" 
                          secondary={job.educationLevel || 'Non spécifié'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CalendarTodayIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary="Date limite de candidature" 
                          secondary={formatDate(job.applicationDeadline)} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {job.benefits && job.benefits.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Avantages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.benefits.map((benefit, index) => (
                    <Chip 
                      key={index} 
                      label={benefit} 
                      variant="outlined" 
                      color="success" 
                      icon={<CheckCircleIcon />} 
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Informations sur l'employeur */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              À propos de l'employeur
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={job.employer?.establishmentProfile?.logo} 
                alt={job.employer?.establishmentProfile?.name} 
                sx={{ width: 60, height: 60, mr: 2 }}
              >
                <BusinessIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {job.employer?.establishmentProfile?.name || 'Nom non spécifié'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.employer?.establishmentProfile?.sector || 'Secteur non spécifié'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon><LocationOnIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Adresse" 
                  secondary={`${job.employer?.address?.street || ''}, ${job.employer?.address?.city || 'Non spécifié'}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><BusinessIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Taille de l'entreprise" 
                  secondary={job.employer?.establishmentProfile?.companySize || 'Non spécifié'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarTodayIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Année de fondation" 
                  secondary={job.employer?.establishmentProfile?.foundedYear || 'Non spécifié'} 
                />
              </ListItem>
            </List>
            
            <Button
              component={Link}
              to={`/establishments/${job.employer?._id}`}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Voir le profil complet
            </Button>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Informations supplémentaires
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CalendarTodayIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Date de publication" 
                  secondary={formatDate(job.createdAt)} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><PersonIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary="Postes disponibles" 
                  secondary={job.numberOfPositions || '1'} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialogue de candidature */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Postuler à l'offre: {job.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Veuillez rédiger une lettre de motivation pour accompagner votre candidature.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="coverLetter"
            label="Lettre de motivation"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button 
            onClick={handleApply} 
            color="primary" 
            variant="contained"
            disabled={applying}
          >
            {applying ? <CircularProgress size={24} /> : 'Envoyer ma candidature'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetailsPage;
