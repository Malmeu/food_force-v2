import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, Chip, CircularProgress,
  Alert, Grid, Card, CardContent, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MessageIcon from '@mui/icons-material/Message';
import CreateMissionForm from '../../components/missions/CreateMissionForm';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [missionFormOpen, setMissionFormOpen] = useState(false);

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

  const handleUpdateStatus = async (newStatus) => {
    try {
      console.log('Mise à jour du statut:', id, newStatus);
      
      // Forcer l'utilisation de l'URL de l'API Render en production
      const baseUrl = 'https://food-force-api.onrender.com';
      console.log('Utilisation de l\'URL API Render:', baseUrl);
      
      const url = new URL(`/api/applications/${id}/status`, baseUrl);
      console.log('URL de mise à jour du statut:', url.toString());
      
      const token = localStorage.getItem('token');
      const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const textResponse = await response.text();
        console.error(`Erreur HTTP ${response.status}:`, textResponse);
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Réponse API mise à jour statut:', data);
      
      // Mettre à jour l'état local
      setApplication(prev => ({ ...prev, status: newStatus }));
      setDialogOpen(false);
      
      // Envoyer une notification au candidat
      try {
        const notificationUrl = new URL('/api/notifications', baseUrl);
        const candidateId = application?.candidate?._id;
        
        if (candidateId) {
          await fetch(notificationUrl.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify({
              recipient: candidateId,
              type: newStatus === 'accepted' ? 'application_accepted' : 'application_rejected',
              content: newStatus === 'accepted' ? 'Votre candidature a été acceptée!' : 'Votre candidature a été refusée.',
              relatedResource: id
            })
          });
          console.log('Notification envoyée au candidat');
        }
      } catch (notifErr) {
        console.error('Erreur lors de l\'envoi de la notification:', notifErr);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Impossible de mettre à jour le statut. Veuillez réessayer plus tard.');
    }
  };

  const handleOpenDialog = (status) => {
    setStatusToUpdate(status);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenMissionForm = () => {
    setMissionFormOpen(true);
  };

  const handleCloseMissionForm = () => {
    setMissionFormOpen(false);
  };

  const handleCreateMission = (mission) => {
    console.log('Mission créée:', mission);
    // Naviguer vers la page de détails de la mission
    navigate(`/establishment/missions/${mission._id}`);
  };

  const handleContactCandidate = () => {
    if (application?.candidate?._id) {
      navigate(`/messages/${application.candidate._id}`);
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
          Détails de la candidature
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
            Reçue le {formatDate(application.appliedAt || application.createdAt)}
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
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate(`/establishment/jobs/${application.job?._id}`)}
              sx={{ mt: 2 }}
            >
              Voir l'offre complète
            </Button>
          </Paper>
        </Grid>
        
        {/* Informations sur le candidat */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Candidat
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                {application.candidate?.firstName || ''} {application.candidate?.lastName || 'Candidat non disponible'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <EmailIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {application.candidate?.email || 'Email non disponible'}
                </Typography>
              </Box>
              
              {application.candidate?.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <PhoneIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.candidate.phone}
                  </Typography>
                </Box>
              )}
              
              {application.candidate?.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {application.candidate.location.city || ''}, {application.candidate.location.country || ''}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate(`/candidate/${application.candidate?._id}`)}
              sx={{ mt: 2 }}
            >
              Voir le profil complet
            </Button>
          </Paper>
        </Grid>
        
        {/* Lettre de motivation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Lettre de motivation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                {application.coverLetter || 'Aucune lettre de motivation fournie.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
              Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {(application.status === 'En attente' || application.status === 'pending') && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleOpenDialog('accepted')}
                    >
                      Accepter
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<CancelIcon />}
                      onClick={() => handleOpenDialog('rejected')}
                    >
                      Refuser
                    </Button>
                  </Grid>
                </>
              )}
              
              {(application.status === 'Acceptée' || application.status === 'accepted') && (
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleOpenMissionForm}
                  >
                    Créer une mission
                  </Button>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<MessageIcon />}
                  onClick={handleContactCandidate}
                >
                  Contacter
                </Button>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => navigate('/establishment/applications')}
                >
                  Retour à la liste
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog de confirmation pour la mise à jour du statut */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {statusToUpdate === 'accepted' ? 'Accepter la candidature' : 'Refuser la candidature'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {statusToUpdate === 'accepted' 
              ? 'Êtes-vous sûr de vouloir accepter cette candidature ? Le candidat sera notifié.'
              : 'Êtes-vous sûr de vouloir refuser cette candidature ? Le candidat sera notifié.'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button 
            onClick={() => handleUpdateStatus(statusToUpdate)} 
            color={statusToUpdate === 'accepted' ? 'success' : 'error'}
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Formulaire de création de mission */}
      <Dialog open={missionFormOpen} onClose={handleCloseMissionForm} maxWidth="md" fullWidth>
        <DialogTitle>Créer une mission pour {application.candidate?.firstName} {application.candidate?.lastName}</DialogTitle>
        <DialogContent>
          <CreateMissionForm 
            candidateId={application.candidate?._id} 
            jobId={application.job?._id}
            onSubmit={handleCreateMission}
            onCancel={handleCloseMissionForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ApplicationDetailsPage;
