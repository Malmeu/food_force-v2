import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const WhyUsPage = () => {
  const theme = useTheme();

  const keyFeatures = [
    {
      title: 'Recrutement simplifié',
      description: 'Publiez des offres d\'emploi en quelques clics et accédez à une base de candidats qualifiés dans le secteur alimentaire.',
      icon: <SpeedIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Vérification des profils',
      description: 'Tous nos candidats sont vérifiés pour garantir des profils de qualité et adaptés à vos besoins.',
      icon: <VerifiedUserIcon fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Support dédié',
      description: 'Une équipe de conseillers spécialisés dans le secteur alimentaire vous accompagne à chaque étape.',
      icon: <SupportAgentIcon fontSize="large" />,
      color: '#2196f3', // blue
    },
    {
      title: 'Tarification transparente',
      description: 'Des forfaits adaptés à tous les types d\'établissements, sans frais cachés.',
      icon: <AttachMoneyIcon fontSize="large" />,
      color: '#4caf50', // green
    },
  ];

  const testimonials = [
    {
      name: 'Restaurant Le Gourmet',
      role: 'Restaurant gastronomique',
      quote: 'Grâce à Food Force, nous avons trouvé un chef pâtissier qualifié en moins d\'une semaine. Le processus était simple et efficace.',
      avatar: '/images/testimonial1.jpg',
    },
    {
      name: 'Café des Artistes',
      role: 'Café-restaurant',
      quote: 'La plateforme nous a permis de constituer une équipe fiable pour notre ouverture. Le support client a été exceptionnel.',
      avatar: '/images/testimonial2.jpg',
    },
    {
      name: 'Hôtel Royal Palace',
      role: 'Hôtel 5 étoiles',
      quote: 'Food Force est devenu notre partenaire privilégié pour tous nos besoins en personnel. La qualité des candidats est remarquable.',
      avatar: '/images/testimonial3.jpg',
    },
  ];

  return (
    <>
      {/* Introduction */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Pourquoi choisir Food Force ?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mb: 4 }}>
          Food Force est la première plateforme spécialisée dans le recrutement et la gestion des ressources humaines pour le secteur alimentaire au Maroc. Notre expertise vous permet de trouver rapidement les meilleurs talents pour votre établissement.
        </Typography>
      </Box>

      {/* Caractéristiques principales */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {keyFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
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
                  backgroundColor: feature.color,
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(feature.color, 0.1), 
                      color: feature.color,
                      width: 64,
                      height: 64,
                      mr: 2
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h5" component="h2" fontWeight="bold">
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Statistiques */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          mb: 8,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Food Force en chiffres
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                color="primary"
                sx={{ mb: 1 }}
              >
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Établissements partenaires
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                color="primary"
                sx={{ mb: 1 }}
              >
                5000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Candidats qualifiés
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                color="primary"
                sx={{ mb: 1 }}
              >
                48h
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Délai moyen de recrutement
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                color="primary"
                sx={{ mb: 1 }}
              >
                92%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Taux de satisfaction
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Avantages */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Nos avantages concurrentiels
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Spécialisation dans le secteur alimentaire"
                  secondary="Des candidats avec des compétences spécifiques à votre domaine"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Algorithme de matching avancé"
                  secondary="Trouvez les candidats qui correspondent parfaitement à vos besoins"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Gestion administrative simplifiée"
                  secondary="Automatisation des contrats et des formalités administratives"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Flexibilité des contrats"
                  secondary="CDD, CDI, intérim ou extras selon vos besoins"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Formation continue"
                  secondary="Accès à des modules de formation pour vos équipes"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Support 7j/7"
                  secondary="Une équipe dédiée à votre service à tout moment"
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* Témoignages */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Ce que disent nos clients
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {testimonials.map((testimonial, index) => (
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
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontStyle: 'italic',
                      position: 'relative',
                      '&::before': {
                        content: '"""',
                        fontSize: '3rem',
                        color: alpha(theme.palette.primary.main, 0.2),
                        position: 'absolute',
                        top: -20,
                        left: -10,
                      }
                    }}
                  >
                    {testimonial.quote}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ width: 48, height: 48, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
          Prêt à transformer votre processus de recrutement ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Rejoignez les centaines d'établissements qui font confiance à Food Force pour leurs besoins en recrutement.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
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
          Commencer gratuitement
        </Button>
      </Paper>
    </>
  );
};

export default WhyUsPage;
