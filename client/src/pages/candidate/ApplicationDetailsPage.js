import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  Alert, Grid, Card, CardContent, Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import MessageIcon from '@mui/icons-material/Message';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Fonction pour formater le statut de candidature
  const formatApplicationStatus = (status) => {
    if (!status) return 'En attente';
    
    // Normaliser le statut en français
    switch(status.toLowerCase()) {
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      case 'pending': return 'En attente';
      default: return status; // Garder le statut tel quel s'il est déjà en français
    }
  };

  // Fonction pour obtenir le nom de l'établissement
  const getEstablishmentName = (job) => {
    if (!job) return 'Entreprise non spécifiée';
    if (job.employer?.establishmentProfile?.name) {
      return job.employer.establishmentProfile.name;
    }
    if (job.employerName) {
      return job.employerName;
    }
    return 'Entreprise non spécifiée';
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Forcer l'utilisation de l'URL de l'API Render en production
        const baseUrl = 'https://food-force-api.onrender.com';
        console.log('Utilisation de l\'URL API Render:', baseUrl);
        
        const url = new URL(`/api/applications/${id}`, baseUrl);
        console.log('URL de récupération des détails de candidature:', url.toString());
        
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json' };
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
        console.log('Détails de la candidature reçus:', data);
        
        if (data.success && data.data) {
          setApplication(data.data);
        } else if (data) {
          setApplication(data);
        } else {
          throw new Error('Format de réponse invalide');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de la candidature:', err);
        setError('Impossible de charger les détails de la candidature. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetails();
    }
  }, [id]);

  const handleContactEmployer = () => {
    if (application?.job?.employer?._id) {
      navigate(`/messages/${application.job.employer._id}`);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!application) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Candidature non trouvée</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Détails de ma candidature
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip 
            label={formatApplicationStatus(application.status)}
            color={
              application.status === 'Acceptée' || application.status === 'accepted' ? 'success' : 
              application.status === 'Refusée' || application.status === 'rejected' ? 'error' : 
              'warning'
            } 
            sx={{ mr: 2 }}
          />
          <Typography variant="subtitle1" color="text.secondary">
            Postulée le {formatDate(application.appliedAt || application.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Informations sur l'offre */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Offre d'emploi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                {application.job?.title || 'Titre non disponible'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <BusinessIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {getEstablishmentName(application.job)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <WorkIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {application.job?.contractType || 'Type de contrat non spécifié'} | {application.job?.sector || 'Secteur non spécifié'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {application.job?.location?.city || 'Emplacement non spécifié'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Publiée le {formatDate(application.job?.createdAt)}
                </Typography>
              </Box>
              
              {application.job?.salary && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.job.salary.amount} {application.job.salary.currency}/{application.job.salary.period}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate(`/candidate/jobs/${application.job?._id}`)}
              sx={{ mt: 2 }}
            >
              Voir l'offre complète
            </Button>
          </Paper>
        </Grid>
        
        {/* Lettre de motivation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Ma lettre de motivation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, height: 'calc(100% - 80px)', overflow: 'auto' }}>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.coverLetter || 'Aucune lettre de motivation fournie.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Statut et actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Statut et actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Statut actuel:
                  </Typography>
                  <Chip 
                    label={formatApplicationStatus(application.status)}
                    color={
                      application.status === 'Acceptée' || application.status === 'accepted' ? 'success' : 
                      application.status === 'Refusée' || application.status === 'rejected' ? 'error' : 
                      'warning'
                    } 
                    sx={{ mt: 1 }}
                  />
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {application.status === 'Acceptée' || application.status === 'accepted' 
                      ? 'Félicitations ! Votre candidature a été acceptée. L\'établissement pourrait vous contacter prochainement pour discuter des prochaines étapes.'
                      : application.status === 'Refusée' || application.status === 'rejected'
                      ? 'Malheureusement, votre candidature n\'a pas été retenue pour ce poste. Ne vous découragez pas et continuez à postuler à d\'autres offres qui correspondent à votre profil.'
                      : 'Votre candidature est en cours d\'examen. L\'établissement vous informera de sa décision prochainement.'
                    }
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<MessageIcon />}
                    onClick={handleContactEmployer}
                  >
                    Contacter l'établissement
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate('/candidate/applications')}
                  >
                    Retour à mes candidatures
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ApplicationDetailsPage;
