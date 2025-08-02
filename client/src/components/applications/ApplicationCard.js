import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Typography,
  Grid,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ApplicationCard = ({ application, userType }) => {
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spu00e9cifiu00e9';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Du00e9terminer la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'warning';
      case 'Examinu00e9e':
        return 'info';
      case 'Entretien':
        return 'primary';
      case 'Acceptu00e9e':
        return 'success';
      case 'Refusu00e9e':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              {application.job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {userType === 'candidat' 
                ? application.job.employer?.establishmentProfile?.name 
                : `${application.candidate?.candidateProfile?.firstName} ${application.candidate?.candidateProfile?.lastName}`}
            </Typography>
          </Box>
          <Chip
            label={application.status}
            color={getStatusColor(application.status)}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {userType === 'candidat' ? (
                <BusinessIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
              ) : (
                <PersonIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
              )}
              <Typography variant="body2">
                {userType === 'candidat' 
                  ? `Type: ${application.job.contractType}` 
                  : `Email: ${application.candidate?.email}`}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarTodayIcon color="action" sx={{ mr: 1, fontSize: 'small' }} />
              <Typography variant="body2">
                Postulu00e9 le: {formatDate(application.appliedAt)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {application.status === 'Acceptu00e9e' && application.mission && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Du00e9tails de la mission
            </Typography>
            <Typography variant="body2">
              Du00e9but: {formatDate(application.mission.startDate)}
              {application.mission.endDate && ` - Fin: ${formatDate(application.mission.endDate)}`}
            </Typography>
            <Typography variant="body2">
              Heures totales: {application.mission.totalHours || 0}
            </Typography>
            <Typography variant="body2">
              Paiement: {application.mission.payment?.status || 'En attente'}
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          component={Link}
          to={`/applications/${application._id}`}
          variant="contained"
          color="primary"
          size="small"
        >
          Voir les du00e9tails
        </Button>
      </CardActions>
    </Card>
  );
};

export default ApplicationCard;
