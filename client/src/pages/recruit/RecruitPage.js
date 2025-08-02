import React, { useState } from 'react';
import SEO from '../../components/seo/SEO';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
  alpha,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PeopleIcon from '@mui/icons-material/People';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RecruitPage = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  
  // Déterminer l'onglet actif en fonction de l'URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/recruit') return 0;
    if (path.includes('/recruit/pourquoi-nous')) return 1;
    if (path.includes('/recruit/offres')) return 2;
    if (path.includes('/recruit/processus')) return 3;
    if (path.includes('/recruit/formation')) return 4;
    return 0;
  };
  
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  const menuItems = [
    { label: 'Recruter', path: '/recruit', icon: <BusinessCenterIcon /> },
    { label: 'Pourquoi nous', path: '/recruit/pourquoi-nous', icon: <InfoIcon /> },
    { label: 'Nos offres', path: '/recruit/offres', icon: <WorkIcon /> },
    { label: 'Processus', path: '/recruit/processus', icon: <PeopleIcon /> },
    { label: 'Formation', path: '/recruit/formation', icon: <SchoolIcon /> },
  ];

  // Définition des métadonnées SEO pour la page de recrutement
  const seoTitle = "Recrutement dans la restauration et l'hôtellerie au Maroc | FoodForce";
  const seoDescription = "Recrutez les meilleurs talents pour votre établissement dans les secteurs de la restauration, l'hôtellerie et l'événementiel au Maroc. Solution complète de recrutement avec FoodForce.";
  const seoKeywords = "recrutement restauration maroc, embauche hôtellerie, recrutement chef cuisinier, trouver serveur maroc, recruter personnel événementiel, recrutement casablanca";
  
  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl="/recruit"
      />
      {/* Section d'en-tête avec fond en dégradé */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 10, md: 12 },
          mt: -10, // Pour supprimer l'espace en haut
          mb: 0,
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
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '80px',
                    height: '4px',
                    backgroundColor: theme.palette.secondary.main,
                    mt: 2,
                    borderRadius: '2px',
                  }
                }}
              >
                Recrutez les meilleurs talents du secteur alimentaire
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  maxWidth: '800px',
                  lineHeight: 1.6,
                  opacity: 0.9,
                }}
              >
                Simplifiez vos RH grâce à notre plateforme tout-en-un et trouvez les candidats parfaits pour vos besoins.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  component={Link}
                  to="/register?type=establishment"
                  sx={{
                    borderRadius: '30px',
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  Commencer à recruter
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  component={Link}
                  to="/recruit/pourquoi-nous"
                  sx={{
                    borderRadius: '30px',
                    px: 3,
                    py: 1.5,
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  En savoir plus
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  height: '300px',
                  width: '100%',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                    zIndex: 1,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-30px',
                    left: '-30px',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    backgroundColor: alpha(theme.palette.primary.light, 0.15),
                    zIndex: 1,
                  }
                }}
              >
                {/* Ici on pourrait ajouter une illustration */}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Menu de navigation */}
      <Box 
        sx={{ 
          backgroundColor: 'white',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
        }}
      >
        <Container maxWidth="lg">
          {isMobile ? (
            <Box sx={{ py: 1 }}>
              <Button
                endIcon={<ExpandMoreIcon />}
                onClick={handleMobileMenuOpen}
                sx={{ 
                  width: '100%', 
                  justifyContent: 'space-between',
                  py: 1.5,
                  px: 2,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                {menuItems[getActiveTab()].label}
              </Button>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  sx: {
                    width: '100%',
                    maxWidth: '100%',
                    mt: 1,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: 2,
                  }
                }}
              >
                {menuItems.map((item, index) => (
                  <MenuItem 
                    key={index}
                    component={Link}
                    to={item.path}
                    onClick={handleMobileMenuClose}
                    selected={getActiveTab() === index}
                    sx={{
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        }
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Tabs 
              value={getActiveTab()} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.secondary.main,
                  height: 3,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  }
                }
              }}
            >
              {menuItems.map((item, index) => (
                <Tab 
                  key={index}
                  component={Link}
                  to={item.path}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                      <Box sx={{ ml: 1 }}>{item.label}</Box>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          )}
        </Container>
      </Box>

      {/* Contenu de la page */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default RecruitPage;
