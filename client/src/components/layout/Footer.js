import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo et description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantIcon sx={{ mr: 1, fontSize: 30 }} />
              <Typography variant="h6" component="div">
                FoodForce Maroc
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              La plateforme de mise en relation entre candidats et établissements dans les secteurs de la restauration, hôtellerie, événementiel, vente et logistique au Maroc.
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="linkedin">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Liens rapides */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom>
              Liens rapides
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/" color="inherit" underline="hover">
                  Accueil
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/jobs" color="inherit" underline="hover">
                  Offres d'emploi
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/about" color="inherit" underline="hover">
                  À propos
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/register" color="inherit" underline="hover">
                  Inscription
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Pour les candidats */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Pour les candidats
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/register" color="inherit" underline="hover">
                  Créer un compte
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/jobs" color="inherit" underline="hover">
                  Rechercher des offres
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/candidate/profile" color="inherit" underline="hover">
                  Gérer votre profil
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/candidate/applications" color="inherit" underline="hover">
                  Suivre vos candidatures
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* Pour les établissements */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Pour les établissements
            </Typography>
            <Box component="ul" sx={{ p: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/register" color="inherit" underline="hover">
                  Créer un compte
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/establishment/jobs/create" color="inherit" underline="hover">
                  Publier une offre
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/establishment/candidates" color="inherit" underline="hover">
                  Rechercher des candidats
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink component={Link} to="/establishment/applications" color="inherit" underline="hover">
                  Gérer les candidatures
                </MuiLink>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
          <Typography variant="body2">
            © {currentYear} FoodForce Maroc. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
