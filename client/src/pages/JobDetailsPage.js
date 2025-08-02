import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { jobsAPI } from '../utils/api';
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

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  // Charger les détails de l'offre d'emploi
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Récupération des détails de l\'offre avec ID:', id);
        
        // Déterminer si nous sommes en production
        const isProduction = process.env.NODE_ENV === 'production';
        console.log('Environnement:', isProduction ? 'production' : 'développement');
        
        // Construire l'URL avec les paramètres
        let baseUrl;
        if (isProduction) {
          // En production, utiliser l'URL complète de l'API Render
          baseUrl = 'https://food-force-api.onrender.com';
        } else {
          // En développement, utiliser le proxy React
          baseUrl = window.location.origin;
        }
        
        const url = new URL(`/api/jobs/${id}`, baseUrl);
        console.log('URL de requête complète:', url.toString());
        
        // Effectuer la requête fetch
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          // Afficher le contenu de la réponse pour débogage
          const textResponse = await response.text();
          console.error(`Erreur HTTP ${response.status}:`, textResponse);
          throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        let data;
        try {
          data = await response.json();
          console.log('Réponse API complète:', data);
          
          if (data && data.success === true && data.data) {
            setJob(data.data);
          } else {
            throw new Error('Format de réponse incorrect');
          }
        } catch (jsonError) {
          console.error('Erreur lors du parsing JSON:', jsonError);
          throw new Error(`Erreur de format JSON: ${jsonError.message}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'offre:', err);
        setError(`Impossible de récupérer les détails de l'offre: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);

  // Vérifier si l'utilisateur a déjà postulé à cette offre
  useEffect(() => {
    const checkApplication = async () => {
      if (isAuthenticated && user?.userType === 'candidat') {
        try {
          // Forcer l'utilisation de l'URL de l'API Render
          const baseUrl = 'https://food-force-api.onrender.com';
          console.log('Utilisation de l\'URL API Render pour vérification:', baseUrl);
          
          const url = new URL('/api/applications/candidate', baseUrl);
          console.log('URL de vérification des candidatures:', url.toString());
          
          const token = localStorage.getItem('token');
          const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          
          const response = await fetch(url.toString(), { method: 'GET', headers });
          
          if (!response.ok) {
            const textResponse = await response.text();
            console.error(`Erreur HTTP ${response.status}:`, textResponse);
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
          }
          
          const data = await response.json();
          console.log('Réponse API candidatures:', data);
          
          // Vérifier que data.data existe et est un tableau avant d'appeler some()
          if (data && data.data && Array.isArray(data.data)) {
            const hasAppliedToJob = data.data.some(app => app.job && app.job._id === id);
            setHasApplied(hasAppliedToJob);
          } else {
            console.warn('Format de réponse inattendu pour les candidatures:', data);
            setHasApplied(false);
          }
        } catch (err) {
          console.error('Erreur lors de la vérification des candidatures:', err);
        }
      }
    };

    checkApplication();
  }, [id, isAuthenticated, user]);

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formater le salaire
  const formatSalary = (salary) => {
    if (!salary) return 'Non spécifié';
    return `${salary.amount} ${salary.currency} / ${salary.period}`;
  };

  // Ouvrir le dialogue de candidature
  const handleOpenApplyDialog = () => {
    if (!isAuthenticated) {
      toast.info('Veuillez vous connecter pour postuler à cette offre');
      navigate('/login');
      return;
    }

    if (user?.userType !== 'candidat') {
      toast.error('Seuls les candidats peuvent postuler aux offres d\'emploi');
      return;
    }

    setOpenDialog(true);
  };

  // Fermer le dialogue de candidature
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Soumettre une candidature
  const handleApply = async () => {
    setApplying(true);
    try {
      // Forcer l'utilisation de l'URL de l'API Render en production
      const baseUrl = 'https://food-force-api.onrender.com';
      console.log('Utilisation de l\'URL API Render:', baseUrl);
      
      const url = new URL('/api/applications', baseUrl);
      console.log('URL de soumission de candidature:', url.toString());
      
      const token = localStorage.getItem('token');
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          job: id,
          coverLetter,
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
      
      toast.success('Votre candidature a été envoyée avec succès');
      setHasApplied(true);
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la candidature:', err);
      toast.error(err.message || 'Erreur lors de l\'envoi de la candidature');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des détails de l'offre...
        </Typography>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error || 'Offre non trouvée'}
        </Typography>
        <Button
          component={Link}
          to="/jobs"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Retour aux offres
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button
        component={Link}
        to="/jobs"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Retour aux offres
      </Button>

      <Grid container spacing={4}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {job.employer?.establishmentProfile?.name || 'Entreprise'}
                  </Typography>
                </Box>
                <Chip
                  label={job.contractType}
                  color={job.contractType === 'CDI' ? 'success' : job.contractType === 'CDD' ? 'primary' : 'secondary'}
                  size="medium"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {job.location?.city || 'Non spécifié'}
                      {job.location?.address && `, ${job.location.address}`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {job.sector}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {formatSalary(job.salary)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Début: {formatDate(job.startDate)}
                      {job.endDate && ` - Fin: ${formatDate(job.endDate)}`}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Horaires: {job.workingHours?.start || ''} - {job.workingHours?.end || ''}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Expérience: {job.experienceLevel || 'Non spécifié'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description du poste
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {job.description}
              </Typography>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Compétences requises
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {job.requiredSkills.map((skill, index) => (
                      <Chip key={index} label={skill} variant="outlined" />
                    ))}
                  </Box>
                </>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Avantages
                  </Typography>
                  <List dense>
                    {job.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {job.workingDays && job.workingDays.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Jours de travail
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {job.workingDays.map((day, index) => (
                      <Chip key={index} label={day} />
                    ))}
                  </Box>
                </>
              )}

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={hasApplied || (isAuthenticated && user?.userType !== 'candidat')}
                  onClick={handleOpenApplyDialog}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {hasApplied ? 'Vous avez déjà postulé' : 'Postuler à cette offre'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations sur l'employeur */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
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
                  {job.employer?.establishmentProfile?.name || 'Entreprise'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.employer?.establishmentProfile?.sector || job.sector}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" paragraph>
              {job.employer?.establishmentProfile?.description || 'Aucune description disponible pour cet employeur.'}
            </Typography>
            <Button
              component={Link}
              to={`/establishments/${job.employer?._id}`}
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
            >
              Voir le profil complet
            </Button>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations complémentaires
            </Typography>
            <List dense>
              {job.applicationDeadline && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date limite de candidature"
                    secondary={formatDate(job.applicationDeadline)}
                  />
                </ListItem>
              )}
              {job.numberOfPositions && (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Nombre de postes"
                    secondary={job.numberOfPositions}
                  />
                </ListItem>
              )}
              {job.educationLevel && (
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Niveau d'études"
                    secondary={job.educationLevel}
                  />
                </ListItem>
              )}
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Date de publication"
                  secondary={formatDate(job.createdAt)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogue de candidature */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Postuler à l'offre: {job.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Présentez-vous brièvement et expliquez pourquoi vous êtes intéressé par ce poste.
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
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            color="primary"
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
