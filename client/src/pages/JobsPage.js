import React, { useState, useEffect } from 'react';
import SEO from '../components/seo/SEO';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../utils/api';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  useTheme,
  alpha,
  Avatar,
  Skeleton,
  Tooltip,
  Badge,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalBarIcon from '@mui/icons-material/LocalBar';

const JobsPage = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Ajout du composant SEO pour le référencement
  const seoTitle = "Offres d'emploi dans la restauration et l'hôtellerie au Maroc | FoodForce";
  const seoDescription = "Découvrez les meilleures offres d'emploi dans la restauration, l'hôtellerie et l'événementiel au Maroc. Postulez en ligne et trouvez votre prochain emploi avec FoodForce.";
  const seoKeywords = "offres emploi restauration maroc, jobs hôtellerie, recrutement chef cuisinier, emploi serveur maroc, travail barman casablanca, emploi réceptionniste maroc";
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    contractType: '',
    city: '',
    servesAlcohol: '',
  });

  // Charger les offres d'emploi au chargement de la page et lors des changements de filtres
  useEffect(() => {
    fetchJobs();
  }, [filters, page]);
  
  // Fonction pour récupérer les offres d'emploi
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Paramètres de base pour la requête
      const params = {
        page: page,
        limit: 10,
        status: 'all' // Récupérer toutes les offres d'emploi, quel que soit leur statut
      };
      
      // Ajouter les filtres sélectionnés s'ils existent
      if (filters.sector) params.sector = filters.sector;
      if (filters.contractType) params.contractType = filters.contractType;
      if (filters.city) params['location.city'] = filters.city;
      if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();
      if (filters.servesAlcohol !== '') params.servesAlcohol = filters.servesAlcohol;
      
      console.log('Paramètres de la requête:', params);
      
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
      
      const url = new URL('/api/jobs', baseUrl);
      
      // Ajouter les paramètres à l'URL
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });
      
      console.log('URL complète de la requête:', url.toString());
      
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
      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError);
        throw new Error(`Erreur de format JSON: ${jsonError.message}`);
      }
      
      // Extraire les offres d'emploi
      let jobsData = [];
      
      if (data && data.success === true && Array.isArray(data.data)) {
        jobsData = data.data;
        console.log(`${jobsData.length} offres trouvées au total`);
        
        // Afficher les IDs des offres pour débogage
        if (jobsData.length > 0) {
          console.log('IDs des offres trouvées:', jobsData.map(job => job._id));
        }
      } else {
        console.log('Format de réponse incorrect ou aucune offre trouvée');
      }
      
      // Si aucune offre n'est trouvée, définir un tableau vide
      if (jobsData.length === 0) {
        setJobs([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      
      // Traitement des offres pour l'affichage
      const processedJobs = jobsData.map(job => {
        // Créer un objet de base avec des valeurs par défaut
        console.log('Traitement de l\'offre avec ID:', job._id);
        
        const processedJob = {
          _id: job._id, // Garder l'ID original tel quel
          id: job._id, // Dupliquer pour compatibilité
          title: job.title || 'Poste non spécifié',
          company: job.employer && job.employer.establishmentProfile && job.employer.establishmentProfile.name 
            ? job.employer.establishmentProfile.name 
            : 'Entreprise non spécifiée',
          logo: job.employer && job.employer.establishmentProfile && job.employer.establishmentProfile.logo
            ? job.employer.establishmentProfile.logo
            : '/images/default-company-logo.png',
          location: job.location && job.location.city ? job.location.city : 'Lieu non spécifié',
          contractType: job.contractType || 'Type de contrat non spécifié',
          sector: job.sector || 'Secteur non spécifié',
          createdAt: job.createdAt ? new Date(job.createdAt) : new Date(),
          deadline: job.applicationDeadline ? new Date(job.applicationDeadline) : null,
          experienceLevel: job.experienceLevel || 'Non spécifié',
          workingHours: job.workingHours || null,
          workingDays: job.workingDays || [],
          description: job.description || 'Aucune description disponible',
          // Sauvegarder toutes les données brutes pour la page de détails
          rawData: { ...job }
        };
        
        // Traitement du salaire
        if (job.salary) {
          const { amount, currency, period } = job.salary;
          processedJob.salary = {
            amount: amount || 0,
            currency: currency || 'MAD',
            period: period || 'Mois'
          };
          
          // Formatage du salaire pour l'affichage
          if (amount) {
            processedJob.formattedSalary = `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency || 'MAD'}/${period || 'Mois'}`;
          } else {
            processedJob.formattedSalary = 'Salaire non spécifié';
          }
        } else {
          processedJob.salary = { amount: 0, currency: 'MAD', period: 'Mois' };
          processedJob.formattedSalary = 'Salaire non spécifié';
        }
        
        // Traitement spécial pour Lunatech (si nécessaire)
        if (job.employer && job.employer.name === 'Lunatech') {
          processedJob.company = 'Lunatech';
          processedJob.logo = '/images/lunatech-logo.png';
        }
        
        return processedJob;
      });
      
      // Mettre à jour l'état avec les offres traitées
      setJobs(processedJobs);
      
      // Mettre à jour la pagination si disponible
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
      } else {
        setTotalPages(1);
      }
      
      // Sauvegarder les offres dans le localStorage pour la persistance
      try {
        localStorage.setItem('savedJobs', JSON.stringify(
          savedJobs.filter(savedJobId => 
            processedJobs.some(job => job.id === savedJobId)
          )
        ));
      } catch (storageError) {
        console.error('Erreur lors de la sauvegarde des offres dans localStorage:', storageError);
      }
      
      // Finaliser le chargement
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      setError(`Impossible de récupérer les offres: ${error.message}`);
      setLoading(false);
    }
  };

  // Gérer le changement de page
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Gérer les changements de filtres
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setPage(1); // Réinitialiser la page lors du changement de filtres
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setFilters({
      search: '',
      sector: '',
      contractType: '',
      city: '',
    });
    setPage(1);
  };

  // Gérer l'ajout/suppression des offres sauvegardées
  const toggleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId));
    } else {
      setSavedJobs([...savedJobs, jobId]);
    }
    // Sauvegarder dans le localStorage pour persistance
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  };
  
  // Charger les offres sauvegardées au chargement de la page
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem('savedJobs');
    if (savedJobsFromStorage) {
      try {
        setSavedJobs(JSON.parse(savedJobsFromStorage));
      } catch (error) {
        console.error('Erreur lors du chargement des offres sauvegardées:', error);
      }
    }
  }, []);

  // Calculer les offres à afficher pour la page actuelle
  const jobsPerPage = 10;
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const displayedJobs = jobs.slice(startIndex, endIndex);

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
      />
      
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 6,
          mb: 4,
          borderRadius: { xs: 0, md: '0 0 20px 20px' },
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Offres d'emploi dans la restauration et l'hôtellerie
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mb: 4, maxWidth: '800px' }}>
            Découvrez les meilleures opportunités d'emploi dans le secteur alimentaire au Maroc
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 2 }}>
        
        {/* Filtres de recherche */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'linear-gradient(to right, #f9f9f9, #ffffff)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterAltIcon sx={{ mr: 1 }} /> Filtrer les offres
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="search"
                label="Rechercher par mot-clé"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Secteur</InputLabel>
                <Select
                  name="sector"
                  value={filters.sector}
                  label="Secteur"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tous les secteurs</MenuItem>
                  <MenuItem value="Bar">Bar</MenuItem>
                  <MenuItem value="Restaurant">Restaurant</MenuItem>
                  <MenuItem value="Restaurant collectif">Restaurant collectif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type de contrat</InputLabel>
                <Select
                  name="contractType"
                  value={filters.contractType}
                  label="Type de contrat"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tous les contrats</MenuItem>
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="CDD">CDD</MenuItem>
                  <MenuItem value="Stage">Stage</MenuItem>
                  <MenuItem value="Freelance">Freelance</MenuItem>
                  <MenuItem value="Temps partiel">Temps partiel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Service d'alcool</InputLabel>
                <Select
                  name="servesAlcohol"
                  value={filters.servesAlcohol}
                  label="Service d'alcool"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tous les établissements</MenuItem>
                  <MenuItem value="true">Avec alcool</MenuItem>
                  <MenuItem value="false">Sans alcool</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Ville</InputLabel>
                <Select
                  name="city"
                  value={filters.city}
                  label="Ville"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Toutes les villes</MenuItem>
                  <MenuItem value="Casablanca">Casablanca</MenuItem>
                  <MenuItem value="Rabat">Rabat</MenuItem>
                  <MenuItem value="Marrakech">Marrakech</MenuItem>
                  <MenuItem value="Tanger">Tanger</MenuItem>
                  <MenuItem value="Agadir">Agadir</MenuItem>
                  <MenuItem value="Fès">Fès</MenuItem>
                  <MenuItem value="Meknès">Meknès</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<RestartAltIcon />} 
                onClick={resetFilters}
                fullWidth
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Affichage des résultats */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Chargement des offres d'emploi...
            </Typography>
          </Box>
        ) : error ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            <WarningAmberIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" color="error" gutterBottom>
              Erreur de chargement
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3 }}
              onClick={fetchJobs}
            >
              Réessayer
            </Button>
          </Paper>
        ) : displayedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Aucune offre trouvée
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Aucune offre d'emploi ne correspond à vos critères de recherche.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RestartAltIcon />}
              onClick={resetFilters}
              sx={{ mt: 2 }}
            >
              Réinitialiser les filtres
            </Button>
            
            {/* Débogage - Afficher les informations de connexion au backend */}
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Informations de débogage:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                URL API: http://localhost:5001/api/jobs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filtres: {JSON.stringify(filters)}
              </Typography>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => {
                  fetch('/api/jobs?status=active')
                    .then(res => res.json())
                    .then(data => {
                      console.log('Test direct API:', data);
                      alert(`API a retourné ${data.count || 0} offres`);
                    })
                    .catch(err => {
                      console.error('Erreur test API:', err);
                      alert(`Erreur API: ${err.message}`);
                    });
                }}
                sx={{ mt: 1 }}
              >
                Tester l'API directement
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                {jobs.length} offre(s) trouvée(s)
              </Typography>
              <Chip 
                icon={<FilterAltIcon />} 
                label={`Filtres: ${Object.values(filters).filter(Boolean).length}`}
                color={Object.values(filters).filter(Boolean).length > 0 ? "primary" : "default"}
                variant={Object.values(filters).filter(Boolean).length > 0 ? "filled" : "outlined"}
              />
            </Box>
            
            <Grid container spacing={2}>
              {displayedJobs.map((job) => (
                <Grid item xs={12} sm={6} md={4} key={job.id}>
                  <Card 
                    elevation={2} 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    
                    <CardContent sx={{ pb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h2" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          {job.title}
                        </Typography>
                        <Chip 
                          label={job.contractType} 
                          color="primary" 
                          size="small" 
                          sx={{ fontWeight: 'medium', fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ color: 'primary.main', mr: 0.5, fontSize: '0.9rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location.city}
                        </Typography>
                        <Box component="span" sx={{ mx: 0.5 }}>•</Box>
                        <WorkIcon fontSize="small" sx={{ color: 'secondary.main', mr: 0.5, fontSize: '0.9rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.sector}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '40px' }}>
                        {job.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon fontSize="small" sx={{ color: 'success.main', mr: 0.5, fontSize: '0.9rem' }} />
                          <Typography variant="body2" fontWeight="medium" fontSize="0.8rem">
                            {job.salary ? `${job.salary} DH` : 'À négocier'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalBarIcon fontSize="small" sx={{ color: job.servesAlcohol ? 'warning.main' : 'success.light', mr: 0.5, fontSize: '0.9rem' }} />
                          <Typography variant="body2" fontSize="0.8rem">
                            {job.servesAlcohol ? 'Avec alcool' : 'Sans alcool'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Divider />
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                        <Tooltip title="Sauvegarder l'offre">
                          <IconButton 
                            color={savedJobs.includes(job.id) ? "primary" : "default"}
                            onClick={() => toggleSaveJob(job.id)}
                            size="small"
                          >
                            {savedJobs.includes(job.id) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        
                        <Button 
                          component={Link} 
                          to={`/jobs/${job._id}`} 
                          variant="contained" 
                          size="small"
                          sx={{
                            borderRadius: '20px',
                            px: 2,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Voir détails
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Paper 
                elevation={1} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 4, 
                  py: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                  showFirstButton 
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 'medium',
                    },
                    '& .Mui-selected': {
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }
                  }}
                />
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default JobsPage;
