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
import DateRangeIcon from '@mui/icons-material/DateRange';
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
          console.log('Données de l\'offre reçues:', JSON.stringify(jobData, null, 2));
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
              
              if (data && data.data) {
                const application = data.data.find(app => app.job?._id === id || app.job === id);
                if (application) {
                  setHasApplied(true);
                  setApplicationStatus(application.status);
                  console.log('Candidature trouvée avec statut:', application.status);
                }
              }
            } catch (err) {
              console.error('Erreur lors de la vérification des candidatures:', err);
              // Ne pas afficher d'erreur à l'utilisateur pour cette vérification
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
      const headers = { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Vous devez être connecté pour postuler');
      }
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          job: id,
          message: 'Candidature via la plateforme FoodForce'
        })
      });
      
      if (!response.ok) {
        const textResponse = await response.text();
        console.error(`Erreur HTTP ${response.status}:`, textResponse);
        throw new Error(`Erreur lors de la candidature: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Réponse de candidature:', data);
      
      toast.success('Votre candidature a été envoyée avec succès !');
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
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
            sx={{ mt: 2 }}
          >
            Retour aux offres d'emploi
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Offre d'emploi non trouvée
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
            sx={{ mt: 2 }}
          >
            Retour aux offres d'emploi
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowBackIcon />}
        sx={{ 
          mb: 4, 
          color: 'text.primary', 
          textTransform: 'none', 
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          }
        }}
      >
        Retour aux offres
      </Button>
      
      <Grid container spacing={4}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em', fontSize: '1.8rem' }}>
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ fontSize: 18, mr: 1, opacity: 0.7 }} />
                  {job.sector} • <LocationOnIcon sx={{ fontSize: 18, mx: 1, opacity: 0.7 }} /> {job.location?.city || 'Non spécifié'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<AttachMoneyIcon />} 
                    label={`${job.salary?.amount || ''} ${job.salary?.currency || 'MAD'}/${job.salary?.period || 'mois'}`} 
                    variant="outlined" 
                    sx={{ fontWeight: 500, borderRadius: 10 }}
                  />
                  
                  <Chip 
                    icon={<CalendarTodayIcon />} 
                    label={`Début: ${formatDate(job.startDate)}`} 
                    variant="outlined" 
                    sx={{ fontWeight: 500, borderRadius: 10 }}
                  />
                  
                  {job.workingHours && job.workingHours.start && job.workingHours.end && (
                    <Chip 
                      icon={<AccessTimeIcon />} 
                      label={`Horaires: ${job.workingHours.start} - ${job.workingHours.end}`} 
                      variant="outlined" 
                      sx={{ fontWeight: 500, borderRadius: 10 }}
                    />
                  )}
                  
                  {job.workingDays && job.workingDays.length > 0 && (
                    <Chip 
                      icon={<DateRangeIcon />} 
                      label={`Jours: ${job.workingDays.join(', ')}`} 
                      variant="outlined" 
                      sx={{ fontWeight: 500, borderRadius: 10 }}
                    />
                  )}
                  
                  <Chip 
                    icon={<PersonIcon />} 
                    label={`Expérience: ${job.experienceLevel || 'Non spécifié'}`} 
                    variant="outlined" 
                    sx={{ fontWeight: 500, borderRadius: 10 }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                {hasApplied ? (
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label={`Candidature ${applicationStatus}`} 
                    color={applicationStatus === 'Acceptée' ? 'success' : applicationStatus === 'Refusée' ? 'error' : 'warning'} 
                    variant="filled" 
                    sx={{ fontWeight: 'bold', py: 0.5 }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleOpenDialog}
                    disabled={hasApplied}
                    sx={{
                      py: 1.5,
                      mt: 2,
                      fontWeight: 600,
                      borderRadius: 10,
                      textTransform: 'none',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      backgroundColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    Postuler maintenant
                  </Button>
                )}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                Description du poste
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {job.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.1rem', mt: 3, letterSpacing: '-0.01em' }}>
                Compétences requises
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {job.requiredSkills && job.requiredSkills.length > 0 ? (
                  job.requiredSkills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: '16px', 
                        fontWeight: 500, 
                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                        border: 'none',
                        px: 1
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune compétence spécifique mentionnée
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
          
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
                    Détails du contrat
                  </Typography>
                  <List dense sx={{ '& .MuiListItem-root': { py: 1.2 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Type de contrat</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{job.contractType || '-'}</Typography>}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Période de mission</Typography>}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {job.startDate && (
                              job.endDate 
                                ? `${formatDate(job.startDate)} - ${formatDate(job.endDate)}` 
                                : `Début: ${formatDate(job.startDate)}`
                            )}
                          </Typography>
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Horaires de travail</Typography>}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {job.workingHours && job.workingHours.start && job.workingHours.end 
                              ? `${job.workingHours.start} - ${job.workingHours.end}` 
                              : '-'}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DateRangeIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Jours de travail</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{job.workingDays && job.workingDays.length > 0 ? job.workingDays.join(', ') : '-'}</Typography>}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card variant="outlined" sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
                    Prérequis
                  </Typography>
                  <List dense sx={{ '& .MuiListItem-root': { py: 1.2 } }}>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Expérience requise</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{job.experienceLevel || '-'}</Typography>}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Niveau d'études</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{job.educationLevel || '-'}</Typography>}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarTodayIcon sx={{ color: 'primary.main', opacity: 0.8 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Date limite de candidature</Typography>}
                        secondary={<Typography variant="body2" color="text.secondary">{job.applicationDeadline ? formatDate(job.applicationDeadline) : '-'}</Typography>}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {job.benefits && job.benefits.length > 0 && (
            <Card variant="outlined" sx={{ 
              mt: 3, 
              borderRadius: 2, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
                  Avantages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {job.benefits.map((benefit, index) => (
                    <Chip 
                      key={index} 
                      label={benefit} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: '16px', 
                        fontWeight: 500,
                        bgcolor: 'rgba(76, 175, 80, 0.08)',
                        border: 'none'
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        {/* Informations complémentaires */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 2, letterSpacing: '-0.01em' }}>
                Informations complémentaires
              </Typography>
              <List dense sx={{ '& .MuiListItem-root': { py: 1 } }}>
                <ListItem>
                  <ListItemText 
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Date limite de candidature</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{job.applicationDeadline ? formatDate(job.applicationDeadline) : '-'}</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Nombre de postes</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{job.vacancies || 1}</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Date de publication</Typography>}
                    secondary={<Typography variant="body2" color="text.secondary">{formatDate(job.createdAt)}</Typography>}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialog de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer votre candidature</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir postuler à cette offre d'emploi ? Votre profil sera partagé avec l'employeur.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={applying}>
            Annuler
          </Button>
          <Button 
            onClick={handleApply} 
            color="primary" 
            variant="contained"
            disabled={applying}
          >
            {applying ? <CircularProgress size={24} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetailsPage;
