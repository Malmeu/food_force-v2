import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, useMediaQuery, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBack } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import ConversationList from '../components/messages/ConversationList';
import MessageChat from '../components/messages/MessageChat';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showChat, setShowChat] = useState(!isMobile);
  const location = useLocation();

  // Extraire l'ID utilisateur de l'URL s'il est présent
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      setSelectedUserId(userId);
      if (isMobile) {
        setShowChat(true);
      }
    }
  }, [location.search, isMobile]);

  // Gérer la sélection d'une conversation
  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowChat(true);
    }
  };

  // Retourner à la liste des conversations sur mobile
  const handleBackToList = () => {
    setShowChat(false);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center">
          Veuillez vous connecter pour accéder à la messagerie
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, bgcolor: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        Messagerie
      </Typography>
      
      <Paper 
        elevation={3}
        sx={{ 
          height: { xs: 'calc(100vh - 180px)', md: 700 }, 
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Grid container sx={{ height: '100%' }}>
          {/* Liste des conversations */}
          {(!isMobile || !showChat) && (
            <Grid item xs={12} md={4} sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
              <ConversationList 
                onSelectConversation={handleSelectConversation} 
                selectedUserId={selectedUserId} 
              />
            </Grid>
          )}
          
          {/* Zone de chat */}
          {(!isMobile || showChat) && (
            <Grid item xs={12} md={8} sx={{ height: '100%', position: 'relative' }}>
              {isMobile && (
                <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                  <IconButton 
                    onClick={handleBackToList} 
                    color="inherit" 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      '&:hover': { bgcolor: 'white' },
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    <ArrowBack />
                  </IconButton>
                </Box>
              )}
              <MessageChat selectedUserId={selectedUserId} />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default MessagesPage;
