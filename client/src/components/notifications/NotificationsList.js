import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, IconButton, Badge, Chip } from '@mui/material';
import { Notifications as NotificationsIcon, Check, Delete, MarkEmailRead } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const NotificationsList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/notifications');
        setNotifications(res.data.data);
        
        // Obtenir le nombre de notifications non lues
        const unreadRes = await api.get('/notifications/unread/count');
        setUnreadCount(unreadRes.data.count);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des notifications:', err);
        setError('Impossible de charger les notifications');
        setLoading(false);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      
      // Mettre à jour l'état local
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      
      // Mettre à jour l'état local
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      
      // Mettre à jour l'état local
      const updatedNotifications = notifications.filter(notif => notif._id !== id);
      setNotifications(updatedNotifications);
      
      // Mettre à jour le compteur si nécessaire
      const deletedNotif = notifications.find(notif => notif._id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
    }
  };

  // Obtenir l'icône en fonction du type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job':
        return <Avatar sx={{ bgcolor: 'primary.main' }}>J</Avatar>;
      case 'application':
        return <Avatar sx={{ bgcolor: 'secondary.main' }}>A</Avatar>;
      case 'message':
        return <Avatar sx={{ bgcolor: 'info.main' }}>M</Avatar>;
      case 'payment':
        return <Avatar sx={{ bgcolor: 'success.main' }}>P</Avatar>;
      default:
        return <Avatar sx={{ bgcolor: 'warning.main' }}><NotificationsIcon /></Avatar>;
    }
  };

  // Formater la date
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  if (loading) return <Typography>Chargement des notifications...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Notifications
          {unreadCount > 0 && (
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
          )}
        </Typography>
        {unreadCount > 0 && (
          <IconButton onClick={markAllAsRead} color="primary" title="Marquer tout comme lu">
            <MarkEmailRead />
          </IconButton>
        )}
      </Box>
      
      {notifications.length === 0 ? (
        <Typography>Aucune notification</Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification._id}>
              <ListItem 
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                  transition: 'background-color 0.3s'
                }}
                secondaryAction={
                  <Box>
                    {!notification.isRead && (
                      <IconButton edge="end" onClick={() => markAsRead(notification._id)} title="Marquer comme lu">
                        <Check />
                      </IconButton>
                    )}
                    <IconButton edge="end" onClick={() => deleteNotification(notification._id)} title="Supprimer">
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  {getNotificationIcon(notification.type)}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography component="span" variant="subtitle1" color="text.primary">
                        {notification.title}
                      </Typography>
                      {!notification.isRead && (
                        <Chip 
                          label="Nouveau" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1, height: 20 }} 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsList;
