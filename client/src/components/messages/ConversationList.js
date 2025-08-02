import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Badge, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI } from '../../utils/api';

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await messageAPI.getConversations();
        console.log('Réponse API conversations:', res);
        
        // Vérifier la structure de la réponse et extraire les données correctement
        let conversationsData = [];
        if (res.data?.success && Array.isArray(res.data?.data)) {
          conversationsData = res.data.data;
        } else if (Array.isArray(res.data)) {
          conversationsData = res.data;
        } else if (res.data?.data && Array.isArray(res.data?.data)) {
          conversationsData = res.data.data;
        }
        
        console.log('Conversations extraites:', conversationsData);
        setConversations(conversationsData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des conversations:', err);
        setError('Impossible de charger les conversations');
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Formater la date du dernier message
  const formatMessageDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'HH:mm', { locale: fr });
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return format(messageDate, 'dd/MM/yyyy', { locale: fr });
    }
  };

  // Obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = (otherUser) => {
    if (!otherUser) return 'Utilisateur inconnu';
    
    if (otherUser.userType === 'candidat') {
      return `${otherUser.candidateProfile?.firstName || ''} ${otherUser.candidateProfile?.lastName || ''}`.trim() || 'Candidat';
    } else {
      return otherUser.establishmentProfile?.name || 'Établissement';
    }
  };

  // Obtenir les initiales pour l'avatar
  const getUserInitials = (otherUser) => {
    if (!otherUser) return 'U';
    
    if (otherUser.userType === 'candidat') {
      const firstName = otherUser.candidateProfile?.firstName || '';
      const lastName = otherUser.candidateProfile?.lastName || '';
      
      if (firstName && lastName) {
        return `${firstName[0]}${lastName[0]}`;
      } else if (firstName) {
        return firstName[0];
      } else {
        return 'C';
      }
    } else {
      const name = otherUser.establishmentProfile?.name || '';
      return name ? name[0] : 'E';
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa', borderRight: 1, borderColor: 'divider' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">
          Conversations
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body2">
            Veuillez réessayer plus tard ou contacter le support.
          </Typography>
        </Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Aucune conversation
          </Typography>
          <Typography variant="body2">
            Vos conversations avec les candidats et établissements apparaîtront ici.
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', p: 0, overflowY: 'auto', flexGrow: 1 }}>
          {conversations.map((conversation) => {
            const otherUser = conversation.user;
            const lastMessage = conversation.lastMessage;
            const isSelected = selectedUserId === otherUser._id;
            const userType = otherUser.userType === 'candidat' ? 'Candidat' : 'Établissement';
            const userColor = otherUser.userType === 'candidat' ? 'primary.main' : 'secondary.main';
            
            return (
              <React.Fragment key={otherUser._id}>
                <ListItem 
                  alignItems="flex-start"
                  button
                  selected={isSelected}
                  onClick={() => onSelectConversation(otherUser._id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      borderLeft: 3,
                      borderColor: userColor,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      badgeContent={conversation.unreadCount}
                      color="error"
                      invisible={conversation.unreadCount === 0}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          height: 20,
                          minWidth: 20,
                          padding: '0 6px',
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: userColor,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {getUserInitials(otherUser)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ 
                            fontWeight: conversation.unreadCount > 0 ? 'bold' : 500,
                            fontSize: '1rem'
                          }}
                        >
                          {getUserDisplayName(otherUser)}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem' }}
                        >
                          {formatMessageDate(lastMessage.createdAt)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            fontSize: '0.75rem',
                            mb: 0.5,
                            color: userColor
                          }}
                        >
                          {userType}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color={conversation.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                          sx={{
                            display: 'block',
                            fontWeight: conversation.unreadCount > 0 ? 500 : 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.85rem'
                          }}
                        >
                          {lastMessage.content}
                        </Typography>
                      </>
                    }
                    sx={{ ml: 1 }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ ml: 9 }} />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default ConversationList;
