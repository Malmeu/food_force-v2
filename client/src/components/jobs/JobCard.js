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
  Grid,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const JobCard = ({ job }) => {
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formater le salaire
  const formatSalary = (salary) => {
    if (!salary) return 'Non spécifié';
    return `${salary.amount} ${salary.currency} / ${salary.period}`;
  };

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {job.employer?.establishmentProfile?.name || 'Entreprise'}
            </Typography>
          </Box>
          <Chip
            label={job.contractType}
            color={job.contractType === 'CDI' ? 'success' : job.contractType === 'CDD' ? 'primary' : 'secondary'}
            size="medium"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {job.location?.city || 'Non spécifié'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {job.sector}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {formatSalary(job.salary)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Début: {formatDate(job.startDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {job.description?.substring(0, 150)}...
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          component={Link}
          to={`/jobs/${job._id}`}
          variant="contained"
          color="primary"
        >
          Voir les détails
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
