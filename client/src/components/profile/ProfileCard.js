import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ProfileCard = ({ user }) => {
  if (!user) return null;

  const isCandidate = user.userType === 'candidat';
  const profile = isCandidate ? user.candidateProfile : user.establishmentProfile;

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={isCandidate ? profile?.profilePicture : profile?.logo}
            alt={isCandidate ? `${profile?.firstName} ${profile?.lastName}` : profile?.name}
            sx={{ width: 80, height: 80, mr: 2 }}
          >
            {isCandidate ? <PersonIcon fontSize="large" /> : <BusinessIcon fontSize="large" />}
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2">
              {isCandidate 
                ? `${profile?.firstName || ''} ${profile?.lastName || ''}` 
                : profile?.name || 'Établissement'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isCandidate 
                ? (profile?.title || 'Candidat') 
                : (profile?.sector || 'Entreprise')}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {user.email}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {user.phone || 'Non spécifié'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                {user.address?.street ? `${user.address.street}, ` : ''}
                {user.address?.city ? `${user.address.city}, ` : ''}
                {user.address?.postalCode ? `${user.address.postalCode}, ` : ''}
                {user.address?.country || 'Maroc'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {isCandidate && profile?.skills && profile.skills.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Compétences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills.map((skill, index) => (
                <Chip key={index} label={skill} size="small" />
              ))}
            </Box>
          </Box>
        )}

        {!isCandidate && profile?.description && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              À propos
            </Typography>
            <Typography variant="body2">
              {profile.description}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
