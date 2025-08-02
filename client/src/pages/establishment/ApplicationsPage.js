import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, CircularProgress,
  Alert, TextField, InputAdornment, IconButton, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, DialogActions, Card, CardContent, Divider, Grid
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { applicationAPI, applicationsAPI } from '../../utils/api';
import CreateMissionForm from '../../components/missions/CreateMissionForm';

// Fonction utilitaire pour extraire les données d'une réponse API
const extractDataFromResponse = (response) => {
  if (!response || !response.data) {
    return [];
  }
  
  // Format API standard: { success: true, data: [...] }
  if (response.data.success && Array.isArray(response.data.data)) {
    return response.data.data;
  } 
  // Format alternatif: tableau direct
  else if (Array.isArray(response.data)) {
    return response.data;
  }
  // Format alternatif: { data: [...] } sans success
  else if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return [];
};

const ApplicationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [missionFormOpen, setMissionFormOpen] = useState(false);
  
  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await applicationAPI.getEmployerApplications();
        console.log('Données des candidatures reçues:', response);
        
        const applicationsData = extractDataFromResponse(response);
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des candidatures:', err);
        setError('Impossible de charger les candidatures. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filtrer les applications en fonction de l'onglet sélectionné et du terme de recherche
  useEffect(() => {
    let filtered = [...applications];
    
    // Filtrer par statut selon l'onglet sélectionné
    if (tabValue === 1) { // En attente
      filtered = filtered.filter(app => 
        app.status === 'En attente' || app.status === 'pending');
    } else if (tabValue === 2) { // Acceptées
      filtered = filtered.filter(app => 
        app.status === 'Acceptée' || app.status === 'accepted');
    } else if (tabValue === 3) { // Refusées
      filtered = filtered.filter(app => 
        app.status === 'Refusée' || app.status === 'rejected');
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        (app.job?.title && app.job.title.toLowerCase().includes(term)) ||
        (app.candidate?.candidateProfile?.firstName && app.candidate.candidateProfile.firstName.toLowerCase().includes(term)) ||
        (app.candidate?.candidateProfile?.lastName && app.candidate.candidateProfile.lastName.toLowerCase().includes(term))
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateMission = (application) => {
    setSelectedApplication(application);
    setMissionFormOpen(true);
  };

  const handleMissionCreated = (mission) => {
    setMissionFormOpen(false);
    setDialogOpen(false);
    // Rediriger vers la page de détails de la mission
    navigate(`/establishment/missions/${mission._id}`);
  };

  const handleCloseMissionForm = () => {
    setMissionFormOpen(false);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      console.log('Mise à jour du statut:', applicationId, newStatus);
      
      // Forcer l'utilisation de l'URL de l'API Render en production
      const baseUrl = 'https://food-force-api.onrender.com';
      console.log('Utilisation de l\'URL API Render:', baseUrl);
      
      const url = new URL(`/api/applications/${applicationId}/status`, baseUrl);
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
      const updatedApplications = applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      );
      
      setApplications(updatedApplications);
      setDialogOpen(false);
      
      // Envoyer une notification au candidat
      try {
        const notificationUrl = new URL('/api/notifications', baseUrl);
        const candidateId = applications.find(app => app._id === applicationId)?.candidate?._id;
        
        if (candidateId) {
          await fetch(notificationUrl.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify({
              recipient: candidateId,
              type: newStatus === 'accepted' ? 'application_accepted' : 'application_rejected',
              content: newStatus === 'accepted' ? 'Votre candidature a été acceptée!' : 'Votre candidature a été refusée.',
              relatedResource: applicationId
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des candidatures
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Barre de recherche et filtres */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Rechercher par nom ou poste"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
          <IconButton color="primary" sx={{ ml: 1 }}>
            <FilterListIcon />
          </IconButton>
        </Box>
        
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Toutes" />
          <Tab label="En attente" />
          <Tab label="Acceptées" />
          <Tab label="Refusées" />
        </Tabs>
      </Paper>
      
      {/* Liste des candidatures */}
      {filteredApplications.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Candidat</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Poste</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date de candidature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application._id} hover>
                  <TableCell>
                    {application.candidate?.candidateProfile?.firstName || ''} {application.candidate?.candidateProfile?.lastName || ''}
                  </TableCell>
                  <TableCell>{application.job?.title || 'Poste non spécifié'}</TableCell>
                  <TableCell>{formatDate(application.appliedAt || application.createdAt)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={application.status} 
                      color={
                        application.status === 'Acceptée' || application.status === 'accepted' ? 'success' : 
                        application.status === 'Refusée' || application.status === 'rejected' ? 'error' : 
                        'warning'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewApplication(application)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Aucune candidature trouvée.
          </Typography>
        </Paper>
      )}
      
      {/* Dialogue de détails de candidature */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedApplication && (
          <>
            <DialogTitle>
              Détails de la candidature
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations sur le candidat
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" gutterBottom>
                        <strong>Nom:</strong> {selectedApplication.candidate?.candidateProfile?.firstName || ''} {selectedApplication.candidate?.candidateProfile?.lastName || ''}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Email:</strong> {selectedApplication.candidate?.email || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Téléphone:</strong> {selectedApplication.candidate?.candidateProfile?.phone || 'Non spécifié'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations sur le poste
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" gutterBottom>
                        <strong>Titre:</strong> {selectedApplication.job?.title || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Type de contrat:</strong> {selectedApplication.job?.contractType || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Lieu:</strong> {selectedApplication.job?.location?.city || 'Non spécifié'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Lettre de motivation
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" paragraph>
                        {selectedApplication.coverLetter || 'Aucune lettre de motivation fournie.'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Box>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<CheckCircleIcon />}
                  sx={{ mr: 1 }}
                  onClick={() => handleUpdateStatus(selectedApplication._id, 'Acceptée')}
                  disabled={selectedApplication.status === 'Acceptée' || selectedApplication.status === 'accepted'}
                >
                  Accepter
                </Button>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<CancelIcon />}
                  onClick={() => handleUpdateStatus(selectedApplication._id, 'Refusée')}
                  disabled={selectedApplication.status === 'Refusée' || selectedApplication.status === 'rejected'}
                >
                  Refuser
                </Button>
                {(selectedApplication.status === 'Acceptée' || selectedApplication.status === 'accepted') && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ ml: 1 }}
                    onClick={() => handleCreateMission(selectedApplication)}
                  >
                    Créer une mission
                  </Button>
                )}
              </Box>
              <Button onClick={handleCloseDialog} variant="outlined">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialogue pour créer une mission */}
      <Dialog open={missionFormOpen} onClose={handleCloseMissionForm} maxWidth="md" fullWidth>
        <DialogTitle>
          Créer une nouvelle mission
        </DialogTitle>
        <DialogContent dividers>
          {selectedApplication && (
            <CreateMissionForm
              applicationId={selectedApplication._id}
              onMissionCreated={handleMissionCreated}
              onCancel={handleCloseMissionForm}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ApplicationsPage;
