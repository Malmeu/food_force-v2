import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  alpha,
  Avatar,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import EventIcon from '@mui/icons-material/Event';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedIcon from '@mui/icons-material/Verified';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';

const AboutPage = () => {
  const theme = useTheme();
  
  return (
    <>
      {/* Section d'introduction avec fond coloré */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 10,
        mt: -2, // Pour supprimer l'espace en haut
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/pattern-overlay.png")',
          backgroundSize: '200px',
          opacity: 0.1,
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              À propos de FoodForce Maroc
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px', mx: 'auto', fontWeight: 300, opacity: 0.9 }}>
              La première plateforme marocaine de mise en relation entre candidats et établissements dans les secteurs de la restauration, hôtellerie, événementiel, vente et logistique.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                component={Link} 
                to="/register"
                sx={{ 
                  borderRadius: 50, 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Rejoignez-nous
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/contact"
                sx={{ 
                  borderRadius: 50, 
                  px: 4, 
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Contactez-nous
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Notre mission avec design moderne */}
        <Box sx={{ 
          position: 'relative', 
          mb: 10,
          pt: 2,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: -100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha(theme.palette.secondary.main, 0.1),
            zIndex: -1
          }
        }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c"
                  alt="Restaurant team working"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'translateY(-20px)',
                    position: 'relative',
                    zIndex: 2
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: -15, 
                  right: -15, 
                  width: '60%', 
                  height: '60%', 
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  zIndex: 1
                }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  position: 'relative',
                  display: 'inline-block',
                  mb: 4,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 80,
                    height: 4,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 2
                  }
                }}
              >
                Notre mission
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                FoodForce Maroc a été créée pour répondre aux besoins spécifiques du marché de l'emploi marocain dans les secteurs de la restauration, l'hôtellerie, l'événementiel, la vente et la logistique.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                Notre mission est de faciliter la rencontre entre les talents et les établissements, en proposant une plateforme moderne, intuitive et efficace qui répond aux enjeux actuels du recrutement dans ces secteurs d'activité.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
                Nous nous engageons à créer un écosystème où les candidats peuvent trouver rapidement des opportunités adaptées à leurs compétences et où les établissements peuvent recruter efficacement des professionnels qualifiés.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Nos valeurs avec cartes colorées */}
        <Box sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 4,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 2
              }
            }}
          >
            Nos valeurs
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
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
                  backgroundColor: '#FF5A5F'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#FF5A5F', 0.1), color: '#FF5A5F', mr: 2 }}>
                      <VerifiedIcon />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight="bold">
                      Transparence
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Nous croyons en une communication claire et honnête avec tous nos utilisateurs. Les informations sur les offres d'emploi, les profils et les conditions sont toujours présentées de manière transparente.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
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
                  backgroundColor: '#26C6DA'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha('#26C6DA', 0.1), color: '#26C6DA', mr: 2 }}>
                      <LightbulbIcon />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight="bold">
                      Innovation
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Nous nous efforçons constamment d'améliorer notre plateforme et d'intégrer les dernières technologies pour offrir une expérience utilisateur optimale et des fonctionnalités innovantes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
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
                  backgroundColor: theme.palette.primary.main
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                      <StarIcon />
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight="bold">
                      Excellence
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Nous visons l'excellence dans tous les aspects de notre service, de la qualité des offres d'emploi à la réactivité de notre support client, en passant par la sécurité de notre plateforme.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Secteurs d'activité avec design moderne */}
        <Box sx={{ 
          mb: 10,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -50,
            right: -100,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha(theme.palette.secondary.main, 0.1),
            zIndex: -1
          }
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 4,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 2
              }
            }}
          >
            Nos secteurs d'activité
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, color: 'text.secondary' }}>
            FoodForce Maroc se spécialise dans les secteurs suivants :
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                    <RestaurantIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Restauration</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Serveurs, cuisiniers, chefs, barmen, managers de restaurant et tout le personnel nécessaire au bon fonctionnement d'un établissement de restauration.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                    <HotelIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Hôtellerie</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Réceptionnistes, femmes de chambre, concierges, managers d'hôtel et tous les métiers liés à l'accueil et au service dans le secteur hôtelier.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                    <EventIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Événementiel</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Organisateurs d'événements, personnel d'accueil, techniciens, serveurs pour événements et tous les professionnels nécessaires à la réussite de vos manifestations.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                    <ShoppingCartIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Vente</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Vendeurs, conseillers commerciaux, responsables de magasin et tous les métiers liés à la vente et au commerce de détail.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 4, 
                height: '100%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, mr: 2 }}>
                    <LocalShippingIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Logistique</Typography>
                </Box>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Chauffeurs-livreurs, préparateurs de commandes, magasiniers et tous les professionnels de la chaîne logistique et du transport.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Pourquoi nous choisir avec design moderne */}
        <Box sx={{ 
          mb: 10,
          p: 5,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
        }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 4,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: theme.palette.secondary.main,
                borderRadius: 2
              }
            }}
          >
            Pourquoi choisir FoodForce Maroc ?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem sx={{ mb: 2, p: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">Plateforme spécialisée</Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                        Nous sommes spécialisés dans les secteurs de la restauration, hôtellerie, événementiel, vente et logistique, ce qui nous permet de mieux comprendre les besoins spécifiques de ces industries.
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ mb: 2, p: 0, mt: 3 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                      <SpeedIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">Processus rapide et efficace</Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                        Notre plateforme est conçue pour permettre aux candidats de postuler rapidement et aux établissements de trouver facilement les profils qui correspondent à leurs besoins.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem sx={{ mb: 2, p: 0 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                      <SecurityIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">Sécurité et confidentialité</Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                        Nous accordons une importance capitale à la protection des données personnelles et professionnelles de nos utilisateurs, conformément aux réglementations en vigueur.
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem sx={{ mb: 2, p: 0, mt: 3 }}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main }}>
                      <SupportAgentIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">Support client réactif</Typography>
                    }
                    secondary={
                      <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
                        Notre équipe de support est disponible pour répondre à toutes vos questions et vous accompagner dans votre utilisation de la plateforme.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Box>

        {/* Appel à l'action */}
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          mb: 6,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Prêt à rejoindre l'aventure ?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
            Que vous soyez candidat à la recherche d'un emploi ou établissement en quête de talents, FoodForce Maroc est là pour vous.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={Link}
              to="/register?type=candidat"
              sx={{ 
                borderRadius: 50, 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              S'inscrire comme candidat
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              to="/register?type=etablissement"
              sx={{ 
                borderRadius: 50, 
                px: 4, 
                py: 1.5,
                fontSize: '1.1rem',
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              S'inscrire comme établissement
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default AboutPage;
