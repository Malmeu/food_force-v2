import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, Grid } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PaymentCard = ({ payment, onUpdateStatus }) => {
  // Formater la date
  const formatDate = (date) => {
    if (!date) return 'Non défini';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente':
        return 'warning';
      case 'Traité':
        return 'info';
      case 'Payé':
        return 'success';
      default:
        return 'default';
    }
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
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="div">
                Paiement pour: {payment.job?.title || 'Mission'}
              </Typography>
              <Chip 
                label={payment.status} 
                color={getStatusColor(payment.status)} 
                size="small" 
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Montant:</strong> {payment.amount} MAD
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Heures travaillées:</strong> {payment.hoursWorked} heures
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Méthode de paiement:</strong> {payment.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 
                                                    payment.paymentMethod === 'cash' ? 'Espèces' : 'Paiement mobile'}
              </Typography>
              {payment.paymentDate && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Date de paiement:</strong> {formatDate(payment.paymentDate)}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Créé le:</strong> {formatDate(payment.createdAt)}
              </Typography>
            </Box>
            
            {payment.paymentDetails?.notes && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2">
                  {payment.paymentDetails.notes}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {payment.employer ? 'Employeur:' : 'Candidat:'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {payment.employer ? getUserDisplayName(payment.employer) : getUserDisplayName(payment.candidate)}
                </Typography>
              </Box>
              
              {onUpdateStatus && payment.status !== 'Payé' && (
                <Box sx={{ mt: 2 }}>
                  {payment.status === 'En attente' && (
                    <Button 
                      variant="outlined" 
                      color="info" 
                      fullWidth 
                      sx={{ mb: 1 }}
                      onClick={() => onUpdateStatus(payment._id, 'Traité')}
                    >
                      Marquer comme traité
                    </Button>
                  )}
                  <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth
                    onClick={() => onUpdateStatus(payment._id, 'Payé')}
                  >
                    Marquer comme payé
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
