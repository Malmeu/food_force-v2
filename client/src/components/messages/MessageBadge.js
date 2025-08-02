import React, { useState, useEffect } from 'react';
import { Badge, IconButton } from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api, { messagesAPI } from '../../utils/api';

const MessageBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger le nombre de messages non lus
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      
      try {
        console.log('Tentative de récupération des messages non lus...');
        const data = await messagesAPI.getUnreadCount();
        
        if (data && data.count !== undefined) {
          setUnreadCount(data.count);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des messages non lus:', err);
      }
    };

    if (user) {
      fetchUnreadCount();
      
      // Rafraîchir le compteur toutes les minutes
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Naviguer vers la page de messagerie
  const handleClick = () => {
    navigate('/messages');
  };

  if (!user) return null;

  return (
    <IconButton color="inherit" onClick={handleClick} aria-label="messages">
      <Badge badgeContent={unreadCount} color="error">
        <EmailIcon />
      </Badge>
    </IconButton>
  );
};

export default MessageBadge;
