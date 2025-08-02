import React, { useState } from 'react';
import SEO from '../components/seo/SEO';
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
  Stack,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Avatar,
  Rating,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentsIcon from '@mui/icons-material/Payments';
import SecurityIcon from '@mui/icons-material/Security';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PeopleIcon from '@mui/icons-material/People';

const HomePage = () => {
  const theme = useTheme();
  const [faqTab, setFaqTab] = useState(0);

  const handleFaqTabChange = (event, newValue) => {
    setFaqTab(newValue);
  };
  
  return (
    <>
      <SEO 
        title="FoodForce Maroc | Emploi Restauration, Hôtellerie et Événementiel au Maroc"
        description="Trouvez votre prochain emploi dans la restauration, l'hôtellerie et l'événementiel au Maroc. Plateforme de recrutement spécialisée pour les professionnels de l'alimentation."
        keywords="emploi restauration maroc, recrutement hôtellerie, jobs événementiel, offres d'emploi maroc, chef cuisinier, serveur, barman, réceptionniste"
        canonicalUrl="/"
      />
      {/* Section Héro avec animation et design moderne - plein écran */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 10, md: 14 },
          mt: -10, // Pour supprimer l'espace en haut
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
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            opacity: 0.3,
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Chip 
                  label="#1 AU MAROC" 
                  color="secondary" 
                  size="small"
                  icon={<CheckCircleIcon />}
                  sx={{ mb: 2, fontWeight: 'bold', px: 1 }}
                />
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  fontWeight="900"
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    lineHeight: 1.2
                  }}
                >
                  Trouvez votre prochain emploi dans la restauration au Maroc
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    fontWeight: 300,
                    fontSize: { xs: '1.1rem', md: '1.3rem' }
                  }}
                >
                  La plateforme qui connecte les talents avec les meilleurs établissements du Maroc. 
                  <Box component="span" sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}>
                    Simple, rapide et efficace.
                  </Box>
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ 
                      py: 1.8, 
                      px: 4, 
                      fontWeight: 'bold',
                      borderRadius: 2,
                      boxShadow: '0 8px 20px rgba(255,152,0,0.3)',
                      '&:hover': {
                        boxShadow: '0 10px 25px rgba(255,152,0,0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Créer un compte gratuitement
                  </Button>
                  <Button
                    component={Link}
                    to="/jobs"
                    variant="outlined"
                    size="large"
                    sx={{ 
                      py: 1.8, 
                      px: 4, 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Voir les offres
                  </Button>
                </Stack>
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 2, opacity: 0.8 }}>
                    Partenaire de confiance pour:
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><RestaurantIcon /></Avatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><HotelIcon /></Avatar>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><LocalCafeIcon /></Avatar>
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: 20,
                    bottom: 20,
                    borderRadius: 4,
                    background: `linear-gradient(45deg, ${theme.palette.secondary.main}22, ${theme.palette.primary.light}22)`,
                    zIndex: 0
                  }
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf"
                  alt="Restaurant staff"
                  sx={{
                    width: '100%',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                    zIndex: 1,
                    transform: 'translateY(0)',
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Espaces Candidat et Recruteur */}
      <Box sx={{ py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            <Box component="span" sx={{ borderBottom: `4px solid ${theme.palette.secondary.main}`, paddingBottom: 1 }}>
              Le candidat ou le job parfait pour vous
            </Box>
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 6, fontWeight: 300 }}>
            En un claquement de doigt !
          </Typography>
          
          <Grid container spacing={4}>
            {/* Espace Candidat */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  overflow: 'hidden', 
                  borderRadius: 4,
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ bgcolor: '#FF5A5F', color: 'white', p: 4, position: 'relative' }}>
                  <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                    ESPACE CANDIDAT
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    TROUVER UN JOB
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      component={Link} 
                      to="/register?type=candidat" 
                      variant="contained" 
                      color="secondary"
                      endIcon={<WorkIcon />}
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#FF5A5F',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        },
                        borderRadius: 50,
                        px: 3
                      }}
                    >
                      TRAVAILLER
                    </Button>
                  </Box>
                  <Box 
                    component="img" 
                    src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf" 
                    alt="Candidate"
                    sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      bottom: 0, 
                      height: '100%', 
                      width: '50%', 
                      objectFit: 'cover',
                      objectPosition: 'center right',
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      display: { xs: 'none', sm: 'block' }
                    }} 
                  />
                </Box>
                <Box sx={{ p: 3, bgcolor: '#f8f8f8' }}>
                  <Typography variant="body1" paragraph>
                    Trouvez des opportunités dans la restauration, l'hôtellerie et l'événementiel. 
                    Postulez en quelques clics et faites évoluer votre carrière.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <Chip label="Restauration" size="small" />
                    <Chip label="Hôtellerie" size="small" />
                    <Chip label="Événementiel" size="small" />
                    <Chip label="Vente" size="small" />
                    <Chip label="Logistique" size="small" />
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Espace Recruteur */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  overflow: 'hidden', 
                  borderRadius: 4,
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <Box sx={{ bgcolor: '#26C6DA', color: 'white', p: 4, position: 'relative' }}>
                  <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                    ESPACE RECRUTEUR
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    RENFORCER VOS ÉQUIPES
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button 
                      component={Link} 
                      to="/register?type=etablissement" 
                      variant="contained" 
                      color="secondary"
                      endIcon={<BusinessIcon />}
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#26C6DA',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        },
                        borderRadius: 50,
                        px: 3
                      }}
                    >
                      RECRUTER
                    </Button>
                  </Box>
                  <Box 
                    component="img" 
                    src="images/recruter.jpeg" 
                    alt="Recruiter"
                    sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      bottom: 0, 
                      height: '100%', 
                      width: '50%', 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderTopRightRadius: 4,
                      borderBottomRightRadius: 4,
                      display: { xs: 'none', sm: 'block' }
                    }} 
                  />
                </Box>
                <Box sx={{ p: 3, bgcolor: '#f8f8f8' }}>
                  <Typography variant="body1" paragraph>
                    Publiez vos offres d'emploi et trouvez rapidement les meilleurs talents pour renforcer vos équipes. 
                    Gérez efficacement vos recrutements.
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <Chip label="Paris" size="small" />
                    <Chip label="Lyon" size="small" />
                    <Chip label="Casablanca" size="small" />
                    <Chip label="Rabat" size="small" />
                    <Chip label="Marrakech" size="small" />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Comment ça marche */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Comment ça marche
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Une solution simple et efficace pour trouver des opportunités professionnelles
        </Typography>

        <Grid container spacing={4}>
          {/* Pour les candidats */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h3">
                  Pour les candidats
                </Typography>
              </Box>
              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" variant="h6" paragraph>
                  Créez votre profil et mettez en avant vos compétences
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Parcourez les offres d'emploi qui correspondent à vos critères
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Postulez en quelques clics et suivez vos candidatures
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Votre paiement directement après validation de vos heures
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/register?type=candidat"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                S'inscrire comme candidat
              </Button>
            </Paper>
          </Grid>

          {/* Pour les établissements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" component="h3">
                  Pour les établissements
                </Typography>
              </Box>
              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" variant="h6" paragraph>
                  Créez votre profil d'établissement et présentez votre activité
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Publiez vos offres d'emploi avec tous les détails nécessaires
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Recevez des candidatures de professionnels qualifiés
                </Typography>
                <Typography component="li" variant="h6" paragraph>
                  Gérez vos missions et validez les heures travaillées
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/register?type=etablissement"
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                S'inscrire comme établissement
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Section Statistiques */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        py: 8,
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            <Box component="span" sx={{ borderBottom: `4px solid ${theme.palette.secondary.main}`, paddingBottom: 1 }}>
              FoodForce en chiffres
            </Box>
          </Typography>
          <Typography variant="h6" align="center" paragraph sx={{ mb: 6, opacity: 0.9 }}>
            Des résultats concrets pour votre carrière et votre établissement
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Statistique 1 */}
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <PeopleIcon sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom fontWeight="bold">
                  5000+
                </Typography>
                <Typography variant="body1">
                  Candidats actifs
                </Typography>
              </Box>
            </Grid>
            
            {/* Statistique 2 */}
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <BusinessIcon sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom fontWeight="bold">
                  850+
                </Typography>
                <Typography variant="body1">
                  Établissements partenaires
                </Typography>
              </Box>
            </Grid>
            
            {/* Statistique 3 */}
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <WorkIcon sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom fontWeight="bold">
                  12000+
                </Typography>
                <Typography variant="body1">
                  Offres d'emploi publiées
                </Typography>
              </Box>
            </Grid>
            
            {/* Statistique 4 */}
            <Grid item xs={6} md={3}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3, 
                borderRadius: 4, 
                bgcolor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(5px)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}>
                <CheckCircleIcon sx={{ fontSize: 50, color: theme.palette.secondary.main, mb: 2 }} />
                <Typography variant="h3" component="div" gutterBottom fontWeight="bold">
                  95%
                </Typography>
                <Typography variant="body1">
                  Taux de satisfaction
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section FAQ */}
      <Container maxWidth="lg" sx={{ py: 8, mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Questions fréquemment posées
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Tout ce que vous devez savoir sur FoodForce Maroc
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={faqTab} 
            onChange={handleFaqTabChange} 
            centered
            sx={{ 
              mb: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.secondary.main,
                height: 3
              },
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                textTransform: 'none',
                minWidth: 120,
                '&.Mui-selected': {
                  color: theme.palette.secondary.main
                }
              }
            }}
          >
            <Tab label="Pour les candidats" />
            <Tab label="Pour les établissements" />
          </Tabs>
          
          {/* FAQ pour les candidats */}
          <Box hidden={faqTab !== 0}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comment créer un compte candidat ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Pour créer un compte candidat, cliquez sur le bouton "Créer un compte" en haut de la page, sélectionnez "Candidat" et suivez les étapes d'inscription. Vous devrez fournir vos informations personnelles, vos compétences et votre expérience professionnelle.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comment postuler à une offre d'emploi ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Parcourez les offres d'emploi disponibles, cliquez sur celle qui vous intéresse, puis sur le bouton "Postuler". Vous pourrez ensuite personnaliser votre candidature avant de l'envoyer à l'établissement.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Tout sur le Statut Auto-Entrepreneur au Maroc</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                <Link href="https://www.youtube.com/watch?v=Nd0CGssooTI&ab_channel=MrHassanELHASANY">https://www.youtube.com/watch?v=Nd0CGssooTI&ab_channel=MrHassanELHASANY</Link>                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Quels types d'emplois sont disponibles ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  FoodForce Maroc propose des emplois dans divers domaines de l'hôtellerie et de la restauration : serveurs, cuisiniers, baristas, réceptionnistes, managers, etc. Vous pouvez filtrer les offres selon votre domaine de compétence.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
          
          {/* FAQ pour les établissements */}
          <Box hidden={faqTab !== 1}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comment publier une offre d'emploi ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Après avoir créé votre compte établissement, accédez à votre tableau de bord, cliquez sur "Mes offres" puis sur "Créer une offre". Remplissez le formulaire avec tous les détails du poste et publiez-la.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comment sélectionner les candidats ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Vous recevrez les candidatures dans votre espace "Candidatures reçues". Vous pourrez consulter les profils, CV et compétences des candidats, puis les contacter directement via notre messagerie intégrée.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Quels sont les frais pour les établissements ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  FoodForce Maroc applique une commission de 10% sur les missions réalisées. La publication d'offres et la consultation des profils sont gratuites. Vous ne payez que lorsque vous engagez un candidat via notre plateforme.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Comment vérifiez-vous les profils des candidats ?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Tous les candidats passent par un processus de vérification qui inclut la validation de leur identité, de leurs diplômes et de leurs expériences professionnelles. Nous proposons également un système d'évaluation par les établissements précédents.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Container>
      
      {/* Section Tu00e9moignages */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
        py: 8, 
        mb: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          backgroundImage: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 20%, transparent 70%)`,
          zIndex: 0
        }
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            <Box component="span" sx={{ borderBottom: `4px solid ${theme.palette.secondary.main}`, paddingBottom: 1 }}>
              Ils nous font confiance
            </Box>
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Découvrez les témoignages de nos utilisateurs satisfaits
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Témoignage 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                position: 'relative',
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
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                    alt="Sarah L."
                    sx={{ width: 60, height: 60, border: '2px solid #FF5A5F' }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">Sarah L.</Typography>
                    <Typography variant="body2" color="text.secondary">Cheffe de Cuisine</Typography>
                    <Rating value={5} readOnly size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                    <FormatQuoteIcon sx={{ fontSize: 40, color: alpha('#FF5A5F', 0.2), transform: 'rotate(180deg)' }} />
                  </Box>
                  <Typography variant="body1" paragraph>
                    Grâce à FoodForce, j'ai trouvé un poste de cheffe dans un restaurant étoilé en moins d'une semaine. 
                    Le processus était simple et rapide, et l'équipe m'a accompagnée tout au long de ma candidature.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Témoignage 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                position: 'relative',
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
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                    alt="Karim M."
                    sx={{ width: 60, height: 60, border: '2px solid #26C6DA' }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">Karim M.</Typography>
                    <Typography variant="body2" color="text.secondary">Directeur de Restaurant</Typography>
                    <Rating value={5} readOnly size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                    <FormatQuoteIcon sx={{ fontSize: 40, color: alpha('#26C6DA', 0.2), transform: 'rotate(180deg)' }} />
                  </Box>
                  <Typography variant="body1" paragraph>
                    FoodForce a transformé notre processus de recrutement. Nous avons pu constituer une équipe complète 
                    pour l'ouverture de notre nouveau restaurant en un temps record. La qualité des profils est exceptionnelle.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Témoignage 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                position: 'relative',
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
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" 
                    alt="Amina B."
                    sx={{ width: 60, height: 60, border: `2px solid ${theme.palette.primary.main}` }}
                  />
                  <Box>
                    <Typography variant="h6" component="div">Amina B.</Typography>
                    <Typography variant="body2" color="text.secondary">Responsable RH - Chaîne Hôtelière</Typography>
                    <Rating value={5} readOnly size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
                    <FormatQuoteIcon sx={{ fontSize: 40, color: alpha(theme.palette.primary.main, 0.2), transform: 'rotate(180deg)' }} />
                  </Box>
                  <Typography variant="body1" paragraph>
                    La plateforme est incroyablement intuitive et efficace. Nous utilisons FoodForce pour tous nos recrutements 
                    saisonniers et permanents. Le suivi des candidatures et la communication avec les candidats sont simplifiés.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Avantages */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Pourquoi choisir FoodForce Maroc
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Des avantages uniques pour tous les utilisateurs de notre plateforme
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <SearchIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    Recherche simplifiée
                  </Typography>
                  <Typography align="center">
                    Trouvez rapidement des offres ou des candidats grâce à notre système de recherche avancé et nos filtres personnalisés.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <AccessTimeIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    Gain de temps
                  </Typography>
                  <Typography align="center">
                    Réduisez le temps consacré au recrutement grâce à notre algorithme de matching qui propose les meilleurs profils pour chaque poste.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                  <PaymentsIcon color="primary" sx={{ fontSize: 60 }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    Paiements sécurisés
                  </Typography>
                  <Typography align="center">
                    Système de validation des heures travaillées et paiements sécurisés par virement bancaire pour une tranquillité d'esprit totale.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Témoignages */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Ils nous font confiance
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Découvrez les témoignages de nos utilisateurs satisfaits
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 4, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "Grâce à FoodForce Maroc, j'ai trouvé plusieurs missions en tant que serveur dans des restaurants de Marrakech. La plateforme est intuitive et les paiements sont toujours effectués rapidement. Je recommande vivement !"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Témoignage"
                    sx={{ width: 60, height: 60, borderRadius: '50%', mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">Karim Benali</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Serveur, Marrakech
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 4, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                  "En tant que gérant d'un hôtel à Casablanca, FoodForce Maroc m'a permis de trouver rapidement du personnel qualifié pour des remplacements urgents. Le processus est simple et les candidats sont de qualité. Un gain de temps considérable !"
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Témoignage"
                    sx={{ width: 60, height: 60, borderRadius: '50%', mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">Leila Tazi</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Directrice d'hôtel, Casablanca
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Section CTA */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          py: 8,
          borderRadius: { xs: 0, md: '50px 50px 0 0' },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Prêt à rejoindre FoodForce Maroc ?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Inscrivez-vous gratuitement et commencez à explorer les opportunités dès aujourd'hui
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component={Link}
              to="/register?type=candidat"
              variant="contained"
              color="primary"
              size="large"
              sx={{ py: 1.5, px: 4 }}
            >
              Je suis candidat
            </Button>
            <Button
              component={Link}
              to="/register?type=etablissement"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 4, color: 'white', borderColor: 'white' }}
            >
              Je suis un établissement
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
