import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper, Avatar, Divider, CircularProgress, IconButton } from '@mui/material';
import { Send as SendIcon, InsertEmoticon as EmojiIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { messageAPI } from '../../utils/api';

const MessageChat = ({ selectedUserId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Charger les messages de la conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      
      try {
        setLoading(true);
        setError(null);
        const res = await messageAPI.getMessages(selectedUserId);
        console.log('Réponse API messages:', res);
        
        // Vérifier la structure de la réponse et extraire les données correctement
        let messagesData = [];
        if (res.data?.success && Array.isArray(res.data?.data)) {
          messagesData = res.data.data;
        } else if (Array.isArray(res.data)) {
          messagesData = res.data;
        } else if (res.data?.data && Array.isArray(res.data?.data)) {
          messagesData = res.data.data;
        }
        
        console.log('Messages extraits:', messagesData);
        setMessages(messagesData);
        
        // Obtenir les informations de l'autre utilisateur à partir du premier message
        if (messagesData.length > 0) {
          const firstMessage = messagesData[0];
          const otherUserData = firstMessage.sender._id === user.id ? firstMessage.recipient : firstMessage.sender;
          setOtherUser(otherUserData);
        } else {
          // Si pas de messages, essayer de récupérer les infos de l'utilisateur directement
          try {
            const userRes = await fetch(`/api/users/${selectedUserId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const userData = await userRes.json();
            if (userData.success && userData.data) {
              setOtherUser(userData.data);
            }
          } catch (userErr) {
            console.error('Erreur lors de la récupération des infos utilisateur:', userErr);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des messages:', err);
        setError('Impossible de charger les messages');
        setLoading(false);
      }
    };

    if (user && selectedUserId) {
      fetchMessages();
    }
  }, [user, selectedUserId]);

  // Faire défiler vers le bas lorsque de nouveaux messages sont chargés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer un nouveau message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedUserId) return;
    
    try {
      setSending(true);
      const res = await messageAPI.sendMessage({
        recipientId: selectedUserId,
        content: newMessage
      });
      
      // Ajouter le nouveau message à la liste
      setMessages([...messages, res.data.data]);
      setNewMessage('');
      setSending(false);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Impossible d\'envoyer le message');
      setSending(false);
    }
  };

  // Formater la date du message
  const formatMessageDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  // Obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = (messageUser) => {
    if (!messageUser) return 'Utilisateur inconnu';
    
    if (messageUser.userType === 'candidat') {
      return `${messageUser.candidateProfile?.firstName || ''} ${messageUser.candidateProfile?.lastName || ''}`.trim() || 'Candidat';
    } else {
      return messageUser.establishmentProfile?.name || 'Établissement';
    }
  };

  // Vérifier si un message est envoyé par l'utilisateur connecté
  const isCurrentUser = (messageUserId) => {
    return messageUserId === user.id;
  };

  if (!selectedUserId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          Sélectionnez une conversation pour afficher les messages
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f5f5f5' }}>
      {/* En-tête de la conversation */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
        {otherUser && (
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: otherUser.userType === 'candidat' ? 'secondary.main' : 'warning.main',
              width: 40,
              height: 40
            }}
          >
            {getUserDisplayName(otherUser).charAt(0)}
          </Avatar>
        )}
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {otherUser ? getUserDisplayName(otherUser) : 'Conversation'}
          </Typography>
          {otherUser && (
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {otherUser.userType === 'candidat' ? 'Candidat' : 'Établissement'}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Zone des messages */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7))', backgroundSize: 'cover' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={50} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', my: 4, p: 3, bgcolor: 'error.light', borderRadius: 2, maxWidth: '80%', mx: 'auto' }}>
            <Typography color="error.dark" variant="h6" gutterBottom>
              Erreur de chargement
            </Typography>
            <Typography color="error.dark">
              {error}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', my: 'auto', p: 4, bgcolor: 'rgba(255,255,255,0.8)', borderRadius: 4, maxWidth: '80%', mx: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Aucun message
            </Typography>
            <Typography variant="body1">
              Commencez la conversation en envoyant un message !
            </Typography>
          </Box>
        ) : (
          messages.map((message) => {
            const isOwn = isCurrentUser(message.sender._id);
            const senderType = message.sender.userType === 'candidat' ? 'Candidat' : 'Établissement';
            const senderColor = message.sender.userType === 'candidat' ? 'primary.main' : 'secondary.main';
            
            return (
              <Box
                key={message._id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start',
                  mb: 3
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isOwn ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    maxWidth: '80%'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mx: 1, 
                      mb: 1,
                      width: 36,
                      height: 36,
                      bgcolor: senderColor,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {getUserDisplayName(message.sender).charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ maxWidth: 'calc(100% - 50px)' }}>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block', 
                        mb: 0.5, 
                        ml: isOwn ? 0 : 1,
                        mr: isOwn ? 1 : 0,
                        textAlign: isOwn ? 'right' : 'left',
                        fontSize: '0.7rem'
                      }}
                    >
                      {senderType} • {formatMessageDate(message.createdAt)}
                    </Typography>
                    
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: isOwn ? 'primary.main' : 'white',
                        color: isOwn ? 'white' : 'text.primary',
                        borderRadius: 2,
                        borderTopRightRadius: isOwn ? 0 : 2,
                        borderTopLeftRadius: isOwn ? 2 : 0,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        wordBreak: 'break-word'
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Paper>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Zone de saisie du message */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <form onSubmit={sendMessage}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <EmojiIcon />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Écrivez votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              variant="outlined"
              size="medium"
              disabled={sending}
              sx={{ 
                mr: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  backgroundColor: '#f5f5f5'
                }
              }}
              InputProps={{
                sx: { py: 1 }
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={sending || !newMessage.trim()}
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&.Mui-disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled'
                },
                width: 48,
                height: 48
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default MessageChat;
