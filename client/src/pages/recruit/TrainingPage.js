import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  useTheme,
  alpha,
  Avatar,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const TrainingPage = () => {
  const theme = useTheme();

  const trainingCategories = [
    {
      title: 'Service en salle',
      description: 'Formations pour améliorer les compétences de service et l\'expérience client',
      icon: <GroupIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Cuisine et préparation',
      description: 'Techniques culinaires et bonnes pratiques en cuisine',
      icon: <MenuBookIcon fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Management d\'équipe',
      description: 'Développez vos compétences de leadership et de gestion',
      icon: <LocalLibraryIcon fontSize="large" />,
      color: '#2196f3', // blue
    },
  ];

  const featuredCourses = [
    {
      title: 'Techniques de service haut de gamme',
      category: 'Service en salle',
      duration: '8 heures',
      level: 'Intermédiaire',
      rating: 4.8,
      students: 245,
    },
    {
      title: 'Hygiène et sécurité alimentaire',
      category: 'Cuisine et préparation',
      duration: '10 heures',
      level: 'Tous niveaux',
      rating: 4.9,
      students: 412,
    },
    {
      title: 'Gestion des conflits en restauration',
      category: 'Management d\'équipe',
      duration: '6 heures',
      level: 'Avancé',
      rating: 4.7,
      students: 189,
    },
  ];

  return (
    <>
      {/* Introduction */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Formation continue
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mb: 4 }}>
          Développez les compétences de vos équipes grâce à nos programmes de formation spécialisés pour le secteur alimentaire. Des cours en ligne et en présentiel adaptés à tous les niveaux.
        </Typography>
      </Box>

      {/* Catégories de formation */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {trainingCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                borderRadius: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '5px',
                  backgroundColor: category.color,
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(category.color, 0.1), 
                      color: category.color,
                      width: 64,
                      height: 64,
                      mr: 2
                    }}
                  >
                    {category.icon}
                  </Avatar>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {category.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {category.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  sx={{ 
                    mt: 2,
                    borderRadius: 30,
                    px: 3,
                  }}
                >
                  Voir les formations
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Formations vedettes */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Formations populaires
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {featuredCourses.map((course, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Chip 
                    label={course.category} 
                    color="primary" 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {course.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ color: '#ffc107', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="medium">
                        {course.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.students} apprenants
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Durée: {course.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Niveau: {course.level}
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ 
                      mt: 2,
                      borderRadius: 30,
                      py: 1,
                    }}
                  >
                    Voir le détail
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Avantages */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          mb: 6,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                  mb: 2
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                Pourquoi former vos équipes avec Food Force ?
              </Typography>
              <Typography variant="body1" paragraph>
                Nos formations sont conçues spécifiquement pour le secteur alimentaire et dispensées par des professionnels expérimentés. Investissez dans le développement de vos équipes pour améliorer la qualité de votre service.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Formations adaptées au secteur alimentaire"
                  secondary="Contenus spécifiques à votre domaine d'activité"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Formats flexibles"
                  secondary="En ligne, en présentiel ou mixte selon vos besoins"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Formateurs experts"
                  secondary="Des professionnels reconnus dans leur domaine"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Suivi des progrès"
                  secondary="Tableaux de bord pour suivre l'évolution de vos équipes"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>

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
          Prêt à développer les compétences de vos équipes ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Découvrez notre catalogue complet de formations et trouvez celles qui correspondent aux besoins de votre établissement.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<SchoolIcon />}
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
          Voir toutes les formations
        </Button>
      </Paper>
    </>
  );
};

export default TrainingPage;
