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
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { applicationAPI } from '../../utils/api';

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
        
        const response = await applicationAPI.getCandidateApplications();
        console.log('Données des candidatures reçues:', response);
        
        const applicationsData = extractDataFromResponse(response);
        setApplications(applicationsData);
        setFilteredApplications(applicationsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des candidatures:', err);
        setError('Impossible de charger vos candidatures. Veuillez réessayer plus tard.');
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
        (app.job?.employer?.establishmentProfile?.name && 
          app.job.employer.establishmentProfile.name.toLowerCase().includes(term))
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

  // Rediriger vers la messagerie avec l'établissement sélectionné
  const handleContactEmployer = (employerId) => {
    navigate(`/messages?userId=${employerId}`);
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
        Mes candidatures
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
            placeholder="Rechercher par poste ou entreprise"
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
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Poste</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Entreprise</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Date de candidature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application._id} hover>
                  <TableCell>{application.job?.title || 'Poste non spécifié'}</TableCell>
                  <TableCell>{application.job?.employer?.establishmentProfile?.name || 'Entreprise non spécifiée'}</TableCell>
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
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleViewApplication(application)}
                        title="Voir les détails"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {(application.status === 'Acceptée' || application.status === 'accepted') && application.job?.employer?._id && (
                        <IconButton 
                          color="secondary" 
                          size="small"
                          onClick={() => handleContactEmployer(application.job.employer._id)}
                          title="Contacter l'établissement"
                        >
                          <ChatIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Vous n'avez pas encore postulé à des offres d'emploi.
          </Typography>
          <Button 
            component={Link} 
            to="/candidate/jobs" 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
          >
            Voir les offres disponibles
          </Button>
        </Paper>
      )}
      
      {/* Dialogue de détails de candidature */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedApplication && (
          <>
            <DialogTitle>
              Détails de ma candidature
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations sur le poste
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WorkIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Poste:</strong> {selectedApplication.job?.title || 'Non spécifié'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Entreprise:</strong> {selectedApplication.job?.employer?.establishmentProfile?.name || 'Non spécifiée'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Lieu:</strong> {selectedApplication.job?.location?.city || 'Non spécifié'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Type de contrat:</strong> {selectedApplication.job?.contractType || 'Non spécifié'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Statut de la candidature
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Date de candidature:</strong> {formatDate(selectedApplication.appliedAt || selectedApplication.createdAt)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={selectedApplication.status} 
                          color={
                            selectedApplication.status === 'Acceptée' || selectedApplication.status === 'accepted' ? 'success' : 
                            selectedApplication.status === 'Refusée' || selectedApplication.status === 'rejected' ? 'error' : 
                            'warning'
                          } 
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body1">
                          {selectedApplication.status === 'Acceptée' || selectedApplication.status === 'accepted' ? 
                            'Votre candidature a été acceptée!' : 
                            selectedApplication.status === 'Refusée' || selectedApplication.status === 'rejected' ? 
                            'Votre candidature n\'a pas été retenue.' : 
                            'Votre candidature est en cours d\'examen.'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ma lettre de motivation
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
            <DialogActions>
              <Button onClick={handleCloseDialog} variant="outlined">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ApplicationsPage;
