import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/api';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, CircularProgress,
  Alert, TextField, InputAdornment, IconButton, Tabs, Tab, Dialog,
  DialogTitle, DialogContent, DialogActions, Card, CardContent, Divider, Grid, Avatar
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
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

const CandidatesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les candidatures pour extraire les candidats uniques
        const response = await applicationAPI.getEmployerApplications();
        console.log('Données des candidatures reçues:', response);
        
        const applicationsData = extractDataFromResponse(response);
        
        // Extraire les candidats uniques des candidatures
        const uniqueCandidates = [];
        const candidateIds = new Set();
        
        applicationsData.forEach(application => {
          if (application.candidate && !candidateIds.has(application.candidate._id)) {
            candidateIds.add(application.candidate._id);
            uniqueCandidates.push({
              ...application.candidate,
              lastApplication: application.appliedAt || application.createdAt,
              applicationStatus: application.status,
              appliedFor: application.job?.title || 'Poste non spécifié'
            });
          }
        });
        
        setCandidates(uniqueCandidates);
        setFilteredCandidates(uniqueCandidates);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des candidats:', err);
        setError('Impossible de charger les candidats. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filtrer les candidats en fonction de l'onglet sélectionné et du terme de recherche
  useEffect(() => {
    let filtered = [...candidates];
    
    // Filtrer par type selon l'onglet sélectionné
    if (tabValue === 1) { // Candidats récents (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(candidate => 
        new Date(candidate.lastApplication) >= thirtyDaysAgo);
    } else if (tabValue === 2) { // Candidats acceptés
      filtered = filtered.filter(candidate => 
        candidate.applicationStatus === 'Acceptée' || candidate.applicationStatus === 'accepted');
    }
    
    // Filtrer par terme de recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(candidate => 
        (candidate.candidateProfile?.firstName && candidate.candidateProfile.firstName.toLowerCase().includes(term)) ||
        (candidate.candidateProfile?.lastName && candidate.candidateProfile.lastName.toLowerCase().includes(term)) ||
        (candidate.email && candidate.email.toLowerCase().includes(term)) ||
        (candidate.appliedFor && candidate.appliedFor.toLowerCase().includes(term))
      );
    }
    
    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewCandidate = async (candidate) => {
    setLoadingProfile(true);
    try {
      // Appel API pour avoir le profil à jour
      const response = await userAPI.getCandidateProfile(candidate._id);
      // Certains backends renvoient { success, data }, d'autres juste { ...profil }
      const freshProfile = response.data?.data || response.data;
      const updatedCandidate = {
        ...candidate,
        ...freshProfile,
        candidateProfile: freshProfile.candidateProfile || candidate.candidateProfile,
        email: freshProfile.email || candidate.email,
      };
      setSelectedCandidate(updatedCandidate);
      setDialogOpen(true);
    } catch (error) {
      setSelectedCandidate(candidate); // fallback : ancienne donnée
      setDialogOpen(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Rediriger vers la messagerie avec le candidat sélectionné
  const handleContactCandidate = (candidateId) => {
    navigate(`/messages?userId=${candidateId}`);
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
        Gestion des candidats
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
          <Tab label="Tous les candidats" />
          <Tab label="Candidats récents" />
          <Tab label="Candidats acceptés" />
        </Tabs>
      </Paper>
      
      {/* Liste des candidats */}
      {filteredCandidates.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Candidat</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Dernière candidature</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Poste</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate._id} hover>
                  <TableCell>
                    {candidate.candidateProfile?.firstName || ''} {candidate.candidateProfile?.lastName || ''}
                  </TableCell>
                  <TableCell>{candidate.email || 'Non spécifié'}</TableCell>
                  <TableCell>{formatDate(candidate.lastApplication)}</TableCell>
                  <TableCell>{candidate.appliedFor}</TableCell>
                  <TableCell>
                    <Chip 
                      label={candidate.applicationStatus} 
                      color={
                        candidate.applicationStatus === 'Acceptée' || candidate.applicationStatus === 'accepted' ? 'success' : 
                        candidate.applicationStatus === 'Refusée' || candidate.applicationStatus === 'rejected' ? 'error' : 
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
                        onClick={() => handleViewCandidate(candidate)}
                        title="Voir le profil"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {(candidate.applicationStatus === 'Acceptée' || candidate.applicationStatus === 'accepted') && (
                        <IconButton 
                          color="secondary" 
                          size="small"
                          onClick={() => handleContactCandidate(candidate._id)}
                          title="Contacter le candidat"
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
            Aucun candidat trouvé.
          </Typography>
        </Paper>
      )}
      
      {/* Dialogue de détails du candidat */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {loadingProfile ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : selectedCandidate && (
          <>
            <DialogTitle>
              Profil du candidat
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                    {selectedCandidate?.candidateProfile?.firstName?.[0] || ''}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {selectedCandidate?.candidateProfile?.firstName || ''} {selectedCandidate?.candidateProfile?.lastName || ''}
                  </Typography>
                  {selectedCandidate.applicationStatus && (
                    <Chip label={selectedCandidate.applicationStatus} color={selectedCandidate.applicationStatus === 'Acceptée' ? 'success' : 'warning'} />
                  )}
                </Grid>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Informations de contact</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="primary" />
                        <span>{selectedCandidate.email || 'Email non spécifié'}</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="primary" />
                        <span>{selectedCandidate.phone || 'Téléphone non spécifié'}</span>
                      </Box>
                    </Box>
                    {selectedCandidate.address && (
                      <Typography variant="body2" color="text.secondary">
                        {selectedCandidate.address.street ? selectedCandidate.address.street + ', ' : ''}{selectedCandidate.address.city || ''} {selectedCandidate.address.country ? '(' + selectedCandidate.address.country + ')' : ''}
                      </Typography>
                    )}
                  </Paper>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Dernière candidature</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon fontSize="small" color="primary" />
                      <span>Poste : {selectedCandidate.appliedFor || 'Non spécifié'}</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <i className="fas fa-calendar-alt" style={{ color: '#1976d2' }} />
                      <span>Date : {selectedCandidate.lastApplication ? new Date(selectedCandidate.lastApplication).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
                    </Box>
                  </Paper>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Compétences</Typography>
                    {selectedCandidate.candidateProfile?.skills && selectedCandidate.candidateProfile.skills.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCandidate.candidateProfile.skills.map((skill, idx) => (
                          <Chip key={idx} label={skill} color="primary" size="small" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Aucune compétence renseignée.</Typography>
                    )}
                  </Paper>
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Secteurs préférés</Typography>
                    {selectedCandidate.candidateProfile?.preferredSectors && selectedCandidate.candidateProfile.preferredSectors.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedCandidate.candidateProfile.preferredSectors.map((sector, idx) => (
                          <Chip key={idx} label={sector} color="secondary" size="small" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Aucun secteur préféré renseigné.</Typography>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Expérience professionnelle</Typography>
                    {selectedCandidate.candidateProfile?.experiences && selectedCandidate.candidateProfile.experiences.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {selectedCandidate.candidateProfile.experiences.map((exp, idx) => (
                          <li key={idx}>
                            <strong>{exp.title}</strong> chez <strong>{exp.company}</strong> ({exp.startDate} - {exp.endDate || 'Présent'})
                            <br />
                            {exp.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Aucune expérience professionnelle renseignée.</Typography>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Formation</Typography>
                    {selectedCandidate.candidateProfile?.education && selectedCandidate.candidateProfile.education.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {selectedCandidate.candidateProfile.education.map((edu, idx) => (
                          <li key={idx}>
                            <strong>{edu.degree}</strong> à <strong>{edu.school}</strong> ({edu.startYear} - {edu.endYear || 'Présent'})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Aucune formation renseignée.</Typography>
                    )}
                  </Paper>
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

export default CandidatesPage;
