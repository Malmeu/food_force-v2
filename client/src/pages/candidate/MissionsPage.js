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
import PaymentIcon from '@mui/icons-material/Payment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { applicationAPI } from '../../utils/api';
import MissionsList from '../../components/missions/MissionsList';
import axios from 'axios';

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

const MissionsPage = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedMission, setSelectedMission] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les candidatures acceptées (qui deviennent des missions)
        const response = await applicationAPI.getCandidateApplications();
        console.log('Données des candidatures reçues:', response);
        
        const applicationsData = extractDataFromResponse(response);
        
        // Filtrer pour ne garder que les candidatures acceptées (missions)
        const acceptedApplications = applicationsData.filter(app => 
          app.status === 'Acceptée' || app.status === 'accepted'
        );
        
        setMissions(acceptedApplications);
        setFilteredMissions(acceptedApplications);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des missions:', err);
        setError('Impossible de charger vos missions. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Filtrer les missions en fonction de l'onglet sélectionné et du terme de recherche
  useEffect(() => {
    let filtered = [...missions];
    
    // Filtrer par statut selon l'onglet sélectionné
    if (tabValue === 1) { // Missions en cours
      filtered = filtered.filter(mission => {
        const now = new Date();
        return mission.mission && mission.mission.startDate && 
          (!mission.mission.endDate || new Date(mission.mission.endDate) > now);
      });
    } else if (tabValue === 2) { // Missions terminées
      filtered = filtered.filter(mission => 
        mission.mission && mission.mission.endDate && new Date(mission.mission.endDate) < new Date());
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(mission => 
        (mission.job?.title && mission.job.title.toLowerCase().includes(term)) ||
        (mission.job?.employer?.establishmentProfile?.name && 
          mission.job.employer.establishmentProfile.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredMissions(filtered);
  }, [missions, searchTerm, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewMission = (mission) => {
    setSelectedMission(mission);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
        Mes missions
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
          <Tab label="Toutes les missions" />
          <Tab label="Missions en cours" />
          <Tab label="Missions terminées" />
        </Tabs>
      </Paper>
      
      {/* Liste des missions */}
      {filteredMissions.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Poste</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Entreprise</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Période</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Paiement</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMissions.map((mission) => (
                <TableRow key={mission._id} hover>
                  <TableCell>{mission.job?.title || 'Poste non spécifié'}</TableCell>
                  <TableCell>{mission.job?.employer?.establishmentProfile?.name || 'Entreprise non spécifiée'}</TableCell>
                  <TableCell>
                    {mission.mission?.startDate ? formatDate(mission.mission.startDate) : 'Non définie'} - 
                    {mission.mission?.endDate ? formatDate(mission.mission.endDate) : 'En cours'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={mission.mission?.payment?.status || 'En attente'} 
                      color={
                        mission.mission?.payment?.status === 'Payé' ? 'success' : 
                        mission.mission?.payment?.status === 'Traité' ? 'info' : 
                        'warning'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewMission(mission)}
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
            Vous n'avez pas encore de missions.
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
      
      {/* Dialogue de détails de mission */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedMission && (
          <>
            <DialogTitle>
              Détails de la mission
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
                          <strong>Poste:</strong> {selectedMission.job?.title || 'Non spécifié'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Entreprise:</strong> {selectedMission.job?.employer?.establishmentProfile?.name || 'Non spécifiée'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Lieu:</strong> {selectedMission.job?.location?.city || 'Non spécifié'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Type de contrat:</strong> {selectedMission.job?.contractType || 'Non spécifié'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Période de la mission
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Date de début:</strong> {selectedMission.mission?.startDate ? 
                            formatDate(selectedMission.mission.startDate) : 'Non définie'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Date de fin:</strong> {selectedMission.mission?.endDate ? 
                            formatDate(selectedMission.mission.endDate) : 'En cours'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Paiement
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PaymentIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Statut:</strong> 
                          <Chip 
                            label={selectedMission.mission?.payment?.status || 'En attente'} 
                            color={
                              selectedMission.mission?.payment?.status === 'Payé' ? 'success' : 
                              selectedMission.mission?.payment?.status === 'Traité' ? 'info' : 
                              'warning'
                            } 
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PaymentIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          <strong>Montant:</strong> {selectedMission.mission?.payment?.amount || 0} MAD
                        </Typography>
                      </Box>
                      
                      {selectedMission.mission?.payment?.date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body1">
                            <strong>Date de paiement:</strong> {formatDate(selectedMission.mission.payment.date)}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Heures travaillées
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {selectedMission.mission?.hoursWorked && selectedMission.mission.hoursWorked.length > 0 ? (
                        <>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell><strong>Date</strong></TableCell>
                                  <TableCell><strong>Heures</strong></TableCell>
                                  <TableCell><strong>Validation</strong></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedMission.mission.hoursWorked.map((entry, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{formatDate(entry.date)}</TableCell>
                                    <TableCell>{entry.hours}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={entry.validated?.byEmployer ? 'Validé' : 'En attente'} 
                                        color={entry.validated?.byEmployer ? 'success' : 'warning'} 
                                        size="small" 
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Typography variant="body1" fontWeight="bold">
                              Total des heures: {selectedMission.mission.totalHours || 0}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <Typography variant="body1">
                          Aucune heure de travail enregistrée pour cette mission.
                        </Typography>
                      )}
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

export default MissionsPage;
