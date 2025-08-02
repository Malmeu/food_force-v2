import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Divider,
  useTheme,
  alpha,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const RecruitHomePage = () => {
  const theme = useTheme();

  const recruitOptions = [
    {
      title: 'Pourquoi Food Force ?',
      description: 'Simplifiez-vous les RH grâce à notre plateforme tout-en-un !',
      icon: <InfoIcon fontSize="large" />,
      color: theme.palette.primary.main,
      path: '/recruit/pourquoi-nous'
    },
    {
      title: 'Recruter',
      description: 'Trouvez votre prochain renfort dans le secteur alimentaire.',
      icon: <WorkIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      path: '/recruit/offres'
    },
    {
      title: 'Processus de recrutement',
      description: 'Un processus simplifié pour des recrutements efficaces.',
      icon: <PeopleIcon fontSize="large" />,
      color: '#2196f3', // blue
      path: '/recruit/processus'
    },
    {
      title: 'Formation',
      description: 'Développez les compétences de vos collaborateurs.',
      icon: <SchoolIcon fontSize="large" />,
      color: '#4caf50', // green
      path: '/recruit/formation'
    }
  ];

  const benefits = [
    'Accès à une base de candidats qualifiés',
    'Processus de recrutement simplifié',
    'Gestion administrative automatisée',
    'Suivi des performances en temps réel',
    'Formation continue pour vos équipes',
    'Support client dédié 7j/7'
  ];

  return (
    <>
      {/* Section principale */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Bienvenue sur Food Force Recrutement
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mb: 4 }}>
          Notre plateforme vous permet de simplifier toutes vos démarches RH, du recrutement à la gestion quotidienne 
          de vos équipes. Découvrez nos différentes solutions adaptées au secteur alimentaire.
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {recruitOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                component={Link} 
                to={option.path}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 4,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    '& .arrow-icon': {
                      transform: 'translateX(5px)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    backgroundColor: option.color,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(option.color, 0.1), 
                        color: option.color,
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {option.icon}
                    </Avatar>
                    <Typography variant="h6" component="h2" fontWeight="bold" color="text.primary">
                      {option.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    {option.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Typography 
                      variant="button" 
                      sx={{ 
                        color: option.color,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      En savoir plus
                      <ArrowForwardIcon 
                        fontSize="small" 
                        sx={{ ml: 1, transition: 'transform 0.3s ease' }}
                        className="arrow-icon"
                      />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section des avantages */}
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
                <SupportAgentIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                Pourquoi choisir Food Force pour vos recrutements ?
              </Typography>
              <Typography variant="body1" paragraph>
                Notre plateforme spécialisée dans le secteur alimentaire vous offre des outils sur mesure pour optimiser votre processus de recrutement et la gestion de vos équipes.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/recruit/pourquoi-nous"
                sx={{
                  borderRadius: 30,
                  px: 3,
                  py: 1,
                  fontWeight: 'bold'
                }}
              >
                Découvrir nos avantages
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <List>
              {benefits.map((benefit, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={benefit}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      {/* Appel à l'action */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          px: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
          }
        }}
      >
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
          Prêt à transformer votre processus de recrutement ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4, opacity: 0.9 }}>
          Rejoignez les centaines d'établissements qui font confiance à Food Force pour leurs besoins en recrutement et en gestion d'équipe.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/register?type=establishment"
            sx={{
              borderRadius: '30px',
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
            Créer un compte gratuit
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={Link}
            to="/contact"
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Contacter un conseiller
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default RecruitHomePage;
