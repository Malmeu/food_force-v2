import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  Alert, Grid, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Forcer l'utilisation de l'URL de l'API Render en production
        const baseUrl = 'https://food-force-api.onrender.com';
        console.log('Utilisation de l\'URL API Render:', baseUrl);
        
        const url = new URL(`/api/jobs/${id}`, baseUrl);
        console.log('URL de récupération des détails de l\'offre:', url.toString());
        
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
        console.log('Détails de l\'offre reçus:', data);
        
        if (data.success && data.data) {
          setJob(data.data);
        } else if (data) {
          setJob(data);
        } else {
          throw new Error('Format de réponse invalide');
        }
        
        // Récupérer les candidatures pour cette offre
        const applicationsUrl = new URL(`/api/jobs/${id}/applications`, baseUrl);
        const applicationsResponse = await fetch(applicationsUrl.toString(), {
          method: 'GET',
          headers
        });
        
        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          console.log('Candidatures reçues:', applicationsData);
          
          if (applicationsData.success && Array.isArray(applicationsData.data)) {
            setApplications(applicationsData.data);
          } else if (Array.isArray(applicationsData)) {
            setApplications(applicationsData);
          } else if (applicationsData.data && Array.isArray(applicationsData.data)) {
            setApplications(applicationsData.data);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'offre:', err);
        setError('Impossible de charger les détails de l\'offre. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleEditJob = () => {
    navigate(`/establishment/jobs/edit/${id}`);
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ? Cette action est irréversible.')) {
      try {
        const baseUrl = 'https://food-force-api.onrender.com';
        const url = new URL(`/api/jobs/${id}`, baseUrl);
        
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(url.toString(), {
          method: 'DELETE',
          headers
        });
        
        if (!response.ok) {
          const textResponse = await response.text();
          console.error(`Erreur HTTP ${response.status}:`, textResponse);
          throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        navigate('/establishment/jobs');
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'offre:', err);
        alert('Impossible de supprimer l\'offre. Veuillez réessayer plus tard.');
      }
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

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Offre d'emploi non trouvée</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {job.title}
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<EditIcon />}
            onClick={handleEditJob}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteJob}
          >
            Supprimer
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Détails de l'offre
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Type de contrat
                    </Typography>
                    <Typography variant="body1">
                      {job.contractType || 'Non spécifié'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Lieu
                    </Typography>
                    <Typography variant="body1">
                      {job.location?.city || 'Non spécifié'}, {job.location?.country || 'Maroc'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de publication
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(job.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Horaires
                    </Typography>
                    <Typography variant="body1">
                      {typeof job.workingHours === 'object' && job.workingHours !== null ? `${job.workingHours.start || ''} - ${job.workingHours.end || ''}` : (job.workingHours || 'Non spécifié')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              {job.salary && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MonetizationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Salaire
                      </Typography>
                      <Typography variant="body1">
                        {job.salary.amount} {job.salary.currency}/{job.salary.period}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {job.description || 'Aucune description fournie.'}
            </Typography>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Compétences requises
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.skills && job.skills.length > 0 ? (
                job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucune compétence spécifiée
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Candidatures */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Candidatures ({applications.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {applications.length > 0 ? (
              <List>
                {applications.map((application) => (
                  <ListItem 
                    key={application._id}
                    button
                    onClick={() => navigate(`/establishment/applications/${application._id}`)}
                    sx={{ 
                      mb: 1, 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${application.candidate?.firstName || ''} ${application.candidate?.lastName || 'Candidat'}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {formatDate(application.appliedAt || application.createdAt)}
                          </Typography>
                          <br />
                          <Chip 
                            label={
                              application.status === 'accepted' || application.status === 'Acceptée' ? 'Acceptée' :
                              application.status === 'rejected' || application.status === 'Refusée' ? 'Refusée' :
                              'En attente'
                            }
                            size="small"
                            color={
                              application.status === 'accepted' || application.status === 'Acceptée' ? 'success' :
                              application.status === 'rejected' || application.status === 'Refusée' ? 'error' :
                              'warning'
                            }
                            sx={{ mt: 0.5 }}
                          />
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Aucune candidature reçue pour cette offre
              </Typography>
            )}
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate('/establishment/applications')}
              sx={{ mt: 2 }}
            >
              Voir toutes les candidatures
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobDetailsPage;
