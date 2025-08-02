import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Card, CardContent, 
  Divider, Button, CircularProgress, Chip, Alert, Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { applicationAPI, jobAPI } from '../../utils/api';

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
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalEarnings: 0
  });

  // Fonction pour formater la date
  const formatDate = (date) => {
    if (!date) return 'Date non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
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
    // Ne pas charger les données si l'utilisateur n'est pas encore disponible
    if (!user) {
      console.log('Utilisateur non disponible, chargement des données reporté');
      return;
    }
    
    console.log('Utilisateur disponible, chargement des données du tableau de bord');
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer les candidatures du candidat
        const applicationsRes = await applicationAPI.getCandidateApplications();
        console.log('Données des candidatures reçues:', applicationsRes);
        
        // Récupérer les offres d'emploi recommandées
        const jobsRes = await jobAPI.getJobs();
        console.log('Données des offres reçues:', jobsRes);
        
        // Extraire les données des réponses API
        const applicationsData = extractDataFromResponse(applicationsRes);
        const jobsData = extractDataFromResponse(jobsRes);
        
        // Mettre à jour les candidatures récentes (les 5 plus récentes)
        const sortedApplications = [...applicationsData].sort((a, b) => 
          new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt)
        );
        setApplications(sortedApplications.slice(0, 5));
        
        // Sélectionner des offres d'emploi recommandées (pour l'instant, simplement les 3 plus récentes)
        // Dans une version future, on pourrait implémenter un système de recommandation basé sur le profil
        const sortedJobs = [...jobsData].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecommendedJobs(sortedJobs.slice(0, 3));
        
        // Calculer les statistiques
        setStats({
          totalApplications: applicationsData.length,
          pendingApplications: applicationsData.filter(app => 
            app.status === 'En attente' || app.status === 'pending').length,
          acceptedApplications: applicationsData.filter(app => 
            app.status === 'Acceptée' || app.status === 'accepted').length,
          rejectedApplications: applicationsData.filter(app => 
            app.status === 'Refusée' || app.status === 'rejected').length,
          totalEarnings: applicationsData.reduce((sum, app) => {
            if (app.mission && app.mission.payment && app.mission.payment.amount) {
              return sum + app.mission.payment.amount;
            }
            return sum;
          }, 0)
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord:', err);
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Ajouter user comme dépendance pour recharger les données quand l'utilisateur est disponible

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
          Bienvenue, {user?.candidateProfile?.firstName || 'Candidat'}
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
              bgcolor: 'warning.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              En attente
            </Typography>
            <Typography component="p" variant="h4">
              {stats.pendingApplications}
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
            <WorkIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Acceptées
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
              bgcolor: 'secondary.main',
              color: 'white',
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <PaymentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography component="h2" variant="h6" gutterBottom>
              Gains totaux
            </Typography>
            <Typography component="p" variant="h4">
              {stats.totalEarnings} MAD
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Candidatures récentes et Offres recommandées */}
      <Grid container spacing={4}>
        {/* Candidatures récentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold">
                Mes candidatures récentes
              </Typography>
              <Button 
                component={Link} 
                to="/candidate/applications" 
                variant="contained" 
                color="primary" 
                size="small"
              >
                Voir tout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {applications.length > 0 ? (
              applications.map((application) => (
                <Card key={application._id} sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {application.job?.title || 'Offre non spécifiée'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <WorkIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {getEstablishmentName(application.job)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Postulé le {formatDate(application.appliedAt || application.createdAt)}
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
                        to={`/candidate/applications/${application._id}`}
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
                  Vous n'avez pas encore postulé à des offres d'emploi.
                </Typography>
                <Button 
                  component={Link} 
                  to="/candidate/jobs" 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Voir les offres
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Offres d'emploi recommandées */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary.main" fontWeight="bold">
                Offres recommandées pour vous
              </Typography>
              <Button 
                component={Link} 
                to="/candidate/jobs" 
                variant="contained" 
                color="primary" 
                size="small"
              >
                Voir tout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <Card key={job._id} sx={{ mb: 2, boxShadow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" fontWeight="bold">
                      {job.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <WorkIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {getEstablishmentName(job)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.location?.city || 'Emplacement non spécifié'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {job.contractType} | {job.sector}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={`${job.salary?.amount || ''} ${job.salary?.currency || 'MAD'}/${job.salary?.period || 'mois'}`} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                      <Button
                        component={Link}
                        to={`/candidate/jobs/${job._id}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Voir l'offre
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Aucune offre recommandée pour le moment.
                </Typography>
                <Button 
                  component={Link} 
                  to="/candidate/jobs" 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Explorer les offres
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
