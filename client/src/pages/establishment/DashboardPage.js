import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent, 
  Divider, Button, CircularProgress, Avatar, Chip, Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { jobAPI, applicationAPI } from '../../utils/api';

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

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };
  
  // Fonction pour obtenir le nom complet du candidat
  const getCandidateName = (candidate) => {
    if (!candidate) return 'Candidat non spécifié';
    if (candidate.candidateProfile?.firstName || candidate.candidateProfile?.lastName) {
      return `${candidate.candidateProfile?.firstName || ''} ${candidate.candidateProfile?.lastName || ''}`.trim();
    }
    return 'Candidat non spécifié';
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les données des offres d'emploi et des candidatures
        const jobsRes = await jobAPI.getEmployerJobs();
        const applicationsRes = await applicationAPI.getEmployerApplications();
        
        console.log('Données des offres reçues:', jobsRes);
        console.log('Données des candidatures reçues:', applicationsRes);
        
        // Extraire les données des réponses API
        const jobsData = extractDataFromResponse(jobsRes);
        const applicationsData = extractDataFromResponse(applicationsRes);
        
        // Mettre à jour les offres d'emploi récentes (les 3 plus récentes)
        const sortedJobs = [...jobsData].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentJobs(sortedJobs.slice(0, 3));
        
        // Mettre à jour les candidatures récentes (les 5 plus récentes)
        const sortedApplications = [...applicationsData].sort((a, b) => 
          new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
        );
        setRecentApplications(sortedApplications.slice(0, 5));
        
        // Calculer les statistiques
        setStats({
          activeJobs: jobsData.filter(job => job.isActive).length,
          totalApplications: applicationsData.length,
          pendingApplications: applicationsData.filter(app => 
            app.status === 'En attente' || app.status === 'pending').length,
          acceptedApplications: applicationsData.filter(app => 
            app.status === 'Acceptée' || app.status === 'accepted').length,
          rejectedApplications: applicationsData.filter(app => 
            app.status === 'Refusée' || app.status === 'rejected').length
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* En-tête du tableau de bord */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tableau de bord
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Bienvenue, {user?.establishmentProfile?.name || 'Établissement'}
        </Typography>
      </Box>
      
      {/* Message d'erreur si nécessaire */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <WorkIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Offres actives
            </Typography>
            <Typography component="p" variant="h4">
              {stats.activeJobs}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'secondary.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Candidatures totales
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalApplications}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Candidatures acceptées
            </Typography>
            <Typography component="p" variant="h4">
              {stats.acceptedApplications}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Candidatures en attente
            </Typography>
            <Typography component="p" variant="h4">
              {stats.pendingApplications}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Offres d'emploi récentes et Candidatures récentes */}
      <Grid container spacing={4}>
        {/* Offres d'emploi récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold">
                Offres d'emploi récentes
              </Typography>
              <Button 
                component={Link} 
                to="/establishment/jobs" 
                variant="contained" 
                color="primary" 
                size="small"
              >
                Voir tout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <Card key={job._id} sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location?.city || 'Emplacement non spécifié'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <WorkIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.contractType} | {job.sector}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Publiée le {formatDate(job.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={job.isActive ? 'Active' : 'Inactive'} 
                        color={job.isActive ? 'success' : 'error'} 
                        size="small" 
                        variant="outlined"
                      />
                      <Button
                        component={Link}
                        to={`/establishment/jobs/${job._id}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Détails
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Aucune offre d'emploi récente.
                </Typography>
                <Button 
                  component={Link} 
                  to="/establishment/jobs/create" 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Créer une offre
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Candidatures récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold">
                Candidatures récentes
              </Typography>
              <Button 
                component={Link} 
                to="/establishment/applications" 
                variant="contained" 
                color="primary" 
                size="small"
              >
                Voir tout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => (
                <Card key={application._id} sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {application.job?.title || 'Offre non spécifiée'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <PeopleIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Candidat: {getCandidateName(application.candidate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Reçue le {formatDate(application.appliedAt || application.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={formatApplicationStatus(application.status)} 
                        color={
                          application.status === 'Acceptée' || application.status === 'accepted' ? 'success' : 
                          application.status === 'Refusée' || application.status === 'rejected' ? 'error' : 
                          'warning'
                        } 
                        size="small" 
                        variant="outlined"
                      />
                      <Button
                        component={Link}
                        to={`/establishment/applications/${application._id}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Détails
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Aucune candidature récente.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
