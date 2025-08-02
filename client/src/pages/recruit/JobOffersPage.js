import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  alpha,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const JobOffersPage = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState({
    search: '',
    jobType: '',
    location: '',
    experience: '',
  });

  // Données fictives pour les offres d'emploi
  const jobOffers = [
    {
      id: 1,
      title: 'Chef de cuisine',
      type: 'CDI',
      location: 'Casablanca',
      company: 'Restaurant Le Gourmet',
      experience: '3+ ans',
      description: 'Nous recherchons un chef de cuisine expérimenté pour diriger notre équipe et créer des menus innovants.',
      requirements: ['Expérience en cuisine gastronomique', 'Management d\'équipe', 'Créativité culinaire'],
      date: '12/04/2025',
    },
    {
      id: 2,
      title: 'Serveur / Serveuse',
      type: 'CDD',
      location: 'Rabat',
      company: 'Café des Artistes',
      experience: '1+ an',
      description: 'Rejoignez notre équipe dynamique pour assurer un service de qualité dans notre café-restaurant.',
      requirements: ['Expérience en service', 'Français et arabe courants', 'Disponibilité soirs et week-ends'],
      date: '10/04/2025',
    },
    {
      id: 3,
      title: 'Pâtissier',
      type: 'CDI',
      location: 'Marrakech',
      company: 'Hôtel Royal Palace',
      experience: '2+ ans',
      description: 'Nous cherchons un pâtissier talentueux pour rejoindre notre brigade et créer des desserts d\'exception.',
      requirements: ['Formation en pâtisserie', 'Maîtrise des techniques de base', 'Créativité et rigueur'],
      date: '08/04/2025',
    },
    {
      id: 4,
      title: 'Responsable de salle',
      type: 'CDI',
      location: 'Tanger',
      company: 'Restaurant La Marina',
      experience: '3+ ans',
      description: 'Vous serez en charge de la gestion de la salle et de l\'équipe de service pour garantir une expérience client exceptionnelle.',
      requirements: ['Expérience en management', 'Sens du service', 'Organisé et rigoureux'],
      date: '05/04/2025',
    },
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilter({
      search: '',
      jobType: '',
      location: '',
      experience: '',
    });
  };

  // Filtrer les offres d'emploi
  const filteredJobs = jobOffers.filter(job => {
    return (
      (filter.search === '' || job.title.toLowerCase().includes(filter.search.toLowerCase()) || job.company.toLowerCase().includes(filter.search.toLowerCase())) &&
      (filter.jobType === '' || job.type === filter.jobType) &&
      (filter.location === '' || job.location === filter.location) &&
      (filter.experience === '' || job.experience === filter.experience)
    );
  });

  // Obtenir les options uniques pour les filtres
  const locations = [...new Set(jobOffers.map(job => job.location))];
  const jobTypes = [...new Set(jobOffers.map(job => job.type))];
  const experiences = [...new Set(jobOffers.map(job => job.experience))];

  return (
    <>
      {/* Introduction */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Nos offres d'emploi
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mb: 4 }}>
          Publiez vos offres d'emploi et accédez à notre base de candidats qualifiés dans le secteur alimentaire. Trouvez rapidement les talents dont vous avez besoin pour votre établissement.
        </Typography>
      </Box>

      {/* Filtres */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          borderRadius: 4, 
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            backgroundColor: theme.palette.primary.main,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            <FilterListIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Filtrer les offres
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="search"
              label="Rechercher"
              value={filter.search}
              onChange={handleFilterChange}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="job-type-label">Type de contrat</InputLabel>
              <Select
                labelId="job-type-label"
                name="jobType"
                value={filter.jobType}
                label="Type de contrat"
                onChange={handleFilterChange}
                sx={{ borderRadius: 2 }}
                startAdornment={
                  <InputAdornment position="start">
                    <WorkIcon color="primary" sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Tous les types</MenuItem>
                {jobTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="location-label">Ville</InputLabel>
              <Select
                labelId="location-label"
                name="location"
                value={filter.location}
                label="Ville"
                onChange={handleFilterChange}
                sx={{ borderRadius: 2 }}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOnIcon color="primary" sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Toutes les villes</MenuItem>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="experience-label">Expérience</InputLabel>
              <Select
                labelId="experience-label"
                name="experience"
                value={filter.experience}
                label="Expérience"
                onChange={handleFilterChange}
                sx={{ borderRadius: 2 }}
                startAdornment={
                  <InputAdornment position="start">
                    <AccessTimeIcon color="primary" sx={{ ml: 1 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="">Toutes</MenuItem>
                {experiences.map((exp, index) => (
                  <MenuItem key={index} value={exp}>{exp}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={resetFilters}
            sx={{ 
              borderRadius: 30,
              px: 3,
              borderWidth: '2px',
              '&:hover': {
                borderWidth: '2px',
              }
            }}
          >
            Réinitialiser les filtres
          </Button>
        </Box>
      </Paper>

      {/* Liste des offres */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '""',
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                mr: 1.5,
              }
            }}
          >
            {filteredJobs.length} offre(s) disponible(s)
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<WorkIcon />}
            sx={{
              borderRadius: 30,
              px: 3,
              fontWeight: 'bold',
            }}
          >
            Publier une offre
          </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Grid item xs={12} key={job.id}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '6px',
                      background: job.type === 'CDI' 
                        ? `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})` 
                        : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    }}
                  />
                  <CardContent sx={{ pt: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              width: 56,
                              height: 56,
                              mr: 2
                            }}
                          >
                            <BusinessIcon fontSize="large" />
                          </Avatar>
                          <Box>
                            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                              {job.title}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                              {job.company}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body1" paragraph>
                          {job.description}
                        </Typography>

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Compétences requises :
                          </Typography>
                          <List dense disablePadding>
                            {job.requirements.map((req, index) => (
                              <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <ArrowForwardIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={req} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          height: '100%',
                          justifyContent: 'space-between',
                          borderLeft: { xs: 'none', md: `1px solid ${alpha(theme.palette.divider, 0.5)}` },
                          pl: { xs: 0, md: 3 },
                          pt: { xs: 2, md: 0 },
                        }}>
                          <Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                              <Chip 
                                label={job.type} 
                                color={job.type === 'CDI' ? 'success' : 'primary'} 
                                size="medium"
                                sx={{ fontWeight: 'bold', borderRadius: '16px' }}
                              />
                              <Chip 
                                icon={<LocationOnIcon />} 
                                label={job.location} 
                                variant="outlined" 
                                size="medium"
                                sx={{ borderRadius: '16px' }}
                              />
                              <Chip 
                                icon={<AccessTimeIcon />} 
                                label={job.experience} 
                                variant="outlined" 
                                size="medium"
                                sx={{ borderRadius: '16px' }}
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Publiée le {job.date}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              sx={{
                                borderRadius: 30,
                                py: 1.5,
                                fontWeight: 'bold',
                                mb: 1,
                              }}
                            >
                              Voir les candidats
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              fullWidth
                              sx={{
                                borderRadius: 30,
                                py: 1.5,
                                fontWeight: 'bold',
                              }}
                            >
                              Modifier l'offre
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', backgroundColor: alpha(theme.palette.info.main, 0.05) }}>
                <Typography variant="h6" color="text.secondary" paragraph>
                  Aucune offre ne correspond à vos critères.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  sx={{ borderRadius: 30, px: 3 }}
                >
                  Réinitialiser les filtres
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Appel à l'action */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Vous ne trouvez pas ce que vous cherchez ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Publiez gratuitement votre offre d'emploi et accédez à notre base de candidats qualifiés dans le secteur alimentaire.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<WorkIcon />}
          sx={{
            borderRadius: 30,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            }
          }}
        >
          Publier une offre d'emploi
        </Button>
      </Paper>
    </>
  );
};

export default JobOffersPage;
