import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api, { notificationsAPI } from '../../utils/api';

const NotificationBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Charger le nombre de notifications non lues
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;
      
      try {
        // Utiliser la nouvelle fonction avec fetch au lieu d'axios
        const data = await notificationsAPI.getUnreadCount();
        setUnreadCount(data.count);
        
        // Charger les 5 dernières notifications avec fetch au lieu d'axios
        const notificationsData = await notificationsAPI.getAll();
        if (notificationsData && notificationsData.data) {
          setNotifications(notificationsData.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des notifications:', err);
      }
    };

    if (user) {
      fetchUnreadCount();
      
      // Rafraîchir les notifications toutes les minutes
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Ouvrir le menu des notifications
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fermer le menu des notifications
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Naviguer vers la page des notifications
  const handleViewAllNotifications = () => {
    handleCloseMenu();
    navigate('/notifications');
  };

  // Marquer une notification comme lue et la visualiser
  const handleViewNotification = async (notification) => {
    handleCloseMenu();
    
    try {
      // Marquer comme lue
      if (!notification.isRead) {
        await api.put(`/notifications/${notification._id}/read`);
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Mettre à jour l'état local
        setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        ));
      }
      
      // Rediriger selon le type de notification
      if (notification.relatedTo?.job) {
        navigate(`/jobs/${notification.relatedTo.job}`);
      } else if (notification.relatedTo?.application) {
        navigate(`/applications/${notification.relatedTo.application}`);
      } else if (notification.relatedTo?.user) {
        navigate(`/messages/${notification.relatedTo.user}`);
      } else {
        navigate('/notifications');
      }
    } catch (err) {
      console.error('Erreur lors du traitement de la notification:', err);
    }
  };

  // Tronquer le texte
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpenMenu}
        aria-label="notifications"
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'notifications-button',
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
          Notifications
        </Typography>
        <Divider />
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">Aucune notification</Typography>
          </MenuItem>
        ) : (
          <>
            {notifications.map((notification) => (
              <MenuItem 
                key={notification._id} 
                onClick={() => handleViewNotification(notification)}
                sx={{
                  whiteSpace: 'normal',
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" noWrap>
                    {notification.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {truncateText(notification.message)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleViewAllNotifications}>
              <Typography variant="body2" sx={{ width: '100%', textAlign: 'center', fontWeight: 'bold' }}>
                Voir toutes les notifications
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBadge;
