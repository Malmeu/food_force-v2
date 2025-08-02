import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import PaymentIcon from '@mui/icons-material/Payment';
import NotificationBadge from '../notifications/NotificationBadge';

const Header = () => {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleCloseUserMenu();
  };

  // Options de menu pour les utilisateurs non authentifiu00e9s
  const publicMenuItems = [
    { text: 'Accueil', path: '/' },
    { text: 'Offres d\'emploi', path: '/jobs' },
    { text: 'Recruter', path: '/recruit' },
    { text: 'A propos', path: '/about' },
  ];

  // Options de menu pour les candidats - version simplifiée
  const candidateMenuItems = [
    { text: 'Tableau de bord', path: '/candidate/dashboard', icon: <DashboardIcon /> },
    { text: 'Mon profil', path: '/candidate/profile', icon: <PersonIcon /> },
    { text: 'Candidatures & Missions', path: '/candidate/applications', icon: <WorkIcon /> },
  ];

  // Options de menu pour les établissements - version simplifiée
  const establishmentMenuItems = [
    { text: 'Tableau de bord', path: '/establishment/dashboard', icon: <DashboardIcon /> },
    { text: 'Mon profil', path: '/establishment/profile', icon: <PersonIcon /> },
    { text: 'Offres d\'emploi', path: '/establishment/jobs', icon: <WorkIcon /> },
    { text: 'Gestion des candidatures', path: '/establishment/applications', icon: <HowToRegIcon /> },
    { text: 'Rechercher des talents', path: '/establishment/candidates', icon: <PersonIcon /> },
  ];

  // Déterminer les options de menu en fonction du type d'utilisateur
  const userMenuItems = user?.userType === 'candidat' ? candidateMenuItems : establishmentMenuItems;

  // Drawer pour la navigation mobile
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, bgcolor: '#FF5722', color: 'white' }}>
        <RestaurantIcon sx={{ fontSize: 50, mb: 1 }} />
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          FoodForce Maroc
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {isAuthenticated && user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }} alt={user?.name || 'Utilisateur'} src={user?.profilePicture}>
              {!user?.profilePicture && <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.userType === 'candidat' ? 'Candidat' : 'Établissement'}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        {isAuthenticated ? (
          <>
            <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
              MENU PRINCIPAL
            </Typography>
            {userMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.path}
                sx={{ 
                  borderRadius: 1, 
                  mb: 0.5,
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            <Typography variant="overline" sx={{ px: 2, py: 1, mt: 2, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
              OUTILS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', px: 1 }}>

              <Button
                component={Link}
                to="/notifications"
                startIcon={<NotificationsIcon />}
                size="small"
                sx={{ m: 0.5, borderRadius: 4 }}
                variant="outlined"
              >
                Alertes
              </Button>
              <Button
                component={Link}
                to="/ratings"
                startIcon={<StarIcon />}
                size="small"
                sx={{ m: 0.5, borderRadius: 4 }}
                variant="outlined"
              >
                Avis
              </Button>
              <Button
                component={Link}
                to="/payments"
                startIcon={<PaymentIcon />}
                size="small"
                sx={{ m: 0.5, borderRadius: 4 }}
                variant="outlined"
              >
                Paiements
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{ 
                borderRadius: 1, 
                mb: 0.5,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', color: 'white' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Déconnexion" />
            </ListItem>
          </>
        ) : (
          <>
            <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
              NAVIGATION
            </Typography>
            {publicMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link} 
                to={item.path}
                sx={{ 
                  borderRadius: 1, 
                  mb: 0.5,
                  '&:hover': { bgcolor: 'primary.light', color: 'white' }
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="overline" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
              COMPTE
            </Typography>
            <ListItem 
              button 
              component={Link} 
              to="/login"
              sx={{ 
                borderRadius: 1, 
                mb: 0.5,
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><LoginIcon /></ListItemIcon>
              <ListItemText primary="Connexion" />
            </ListItem>
            <ListItem 
              button 
              component={Link} 
              to="/register"
              sx={{ 
                borderRadius: 1, 
                mb: 0.5,
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><HowToRegIcon /></ListItemIcon>
              <ListItemText primary="Inscription" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl" sx={{ px: 0 }}>
        <Toolbar disableGutters sx={{ height: '64px' }}>
          {/* Logo et titre pour les u00e9crans larges */}
          <RestaurantIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FoodForce Maroc
          </Typography>

          {/* Menu hamburger pour mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              variant="temporary"
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Meilleure performance sur mobile
              }}
              sx={{
                '& .MuiDrawer-paper': { boxSizing: 'border-box' },
                display: { xs: 'block', md: 'none' },
              }}
            >
              {drawer}
            </Drawer>
          </Box>

          {/* Logo et titre pour mobile */}
          <RestaurantIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FoodForce
          </Typography>

          {/* Menu de navigation pour les u00e9crans larges */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {!isAuthenticated && publicMenuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                sx={{ 
                  color: 'white', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '64px',
                  px: 3,
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  transition: 'all 0.2s'
                }}
              >
                {item.text}
              </Button>
            ))}
            
            {isAuthenticated && (
              <>
                {userMenuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={{ 
                      color: 'white', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '64px',
                      px: 3,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      transition: 'all 0.2s'
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
              </>
            )}
          </Box>

          {/* Badge de notification */}
          {isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <NotificationBadge />
            </Box>
          )}

          {/* Menu utilisateur */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Ouvrir les paramètres">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name || 'Utilisateur'} src={user?.profilePicture} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userMenuItems.map((item) => (
                    <MenuItem key={item.text} onClick={handleCloseUserMenu} component={Link} to={item.path}>
                      <Typography textAlign="center">{item.text}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Deconnexion</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ 
                    height: '64px',
                    px: 3,
                    fontWeight: 'bold',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  ME CONNECTER
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{ 
                    height: '64px',
                    px: 3,
                    fontWeight: 'bold',
                    bgcolor: 'white',
                    color: 'primary.main',
                    borderRadius: 0,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  CRÉER UN COMPTE
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
