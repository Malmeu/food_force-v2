import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import NotificationsList from '../components/notifications/NotificationsList';
import { useAuth } from '../contexts/AuthContext';

const NotificationsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center">
          Veuillez vous connecter pour accu00e9der u00e0 vos notifications
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Mes Notifications
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <NotificationsList />
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
