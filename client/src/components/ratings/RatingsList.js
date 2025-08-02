import React from 'react';
import { Box, Typography, Rating, Avatar, Paper, Divider, Chip, Grid } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RatingsList = ({ ratings, averageRating, totalRatings }) => {
  // Formater la date
  const formatDate = (date) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = (user) => {
    if (!user) return 'Utilisateur inconnu';
    
    if (user.userType === 'candidat') {
      return `${user.candidateProfile?.firstName || ''} ${user.candidateProfile?.lastName || ''}`.trim() || 'Candidat';
    } else {
      return user.establishmentProfile?.name || 'Établissement';
    }
  };

  return (
    <Box>
      {/* Résumé des évaluations */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="div" gutterBottom>
              {averageRating ? averageRating.toFixed(1) : '0.0'}
            </Typography>
            <Rating 
              value={averageRating || 0} 
              readOnly 
              precision={0.1} 
              size="large" 
            />
            <Typography variant="body2" color="text.secondary">
              {totalRatings} évaluation{totalRatings !== 1 ? 's' : ''}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Répartition des notes
            </Typography>
            
            {[5, 4, 3, 2, 1].map((star) => {
              // Calculer le pourcentage pour chaque note
              const count = ratings.filter(r => Math.round(r.rating) === star).length;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Box sx={{ minWidth: '30px', mr: 1 }}>
                    <Typography variant="body2">{star}</Typography>
                  </Box>
                  <Rating value={star} readOnly size="small" sx={{ mr: 1 }} />
                  <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', height: 10, borderRadius: 1, overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        width: `${percentage}%`, 
                        bgcolor: 'primary.main', 
                        height: '100%' 
                      }} 
                    />
                  </Box>
                  <Box sx={{ minWidth: '40px', ml: 1 }}>
                    <Typography variant="body2">{count}</Typography>
                  </Box>
                </Box>
              );
            })}
          </Grid>
        </Grid>
      </Paper>

      {/* Liste des évaluations */}
      {ratings.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
          Aucune évaluation pour le moment
        </Typography>
      ) : (
        ratings.map((rating) => (
          <Paper key={rating._id} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: rating.rater.userType === 'candidat' ? 'primary.main' : 'secondary.main' 
                  }}
                >
                  {getUserDisplayName(rating.rater).charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {getUserDisplayName(rating.rater)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(rating.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Rating value={rating.rating} readOnly precision={0.5} />
            </Box>
            
            {rating.comment && (
              <Typography variant="body1" paragraph>
                {rating.comment}
              </Typography>
            )}
            
            {/* Afficher les compétences évaluées */}
            {rating.skills && rating.skills.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Compétences évaluées:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {rating.skills.map((skill, index) => (
                    <Chip 
                      key={index}
                      label={`${skill.name}: ${skill.rating}/5`}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Afficher les critères évalués */}
            {rating.criteria && rating.criteria.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Critères évalués:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {rating.criteria.map((criterion, index) => (
                    <Chip 
                      key={index}
                      label={`${criterion.name}: ${criterion.rating}/5`}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Afficher l'offre d'emploi associée */}
            {rating.application?.job?.title && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Évaluation pour: {rating.application.job.title}
                </Typography>
              </Box>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default RatingsList;
