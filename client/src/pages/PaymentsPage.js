import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Alert, Paper, Button } from '@mui/material';
import PaymentCard from '../components/payments/PaymentCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Charger les paiements
  useEffect(() => {
    const fetchPayments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        let paymentsRes;
        if (user.userType === 'candidat') {
          paymentsRes = await api.get('/payments/candidate');
        } else {
          paymentsRes = await api.get('/payments/employer');
          
          // Charger les statistiques pour les employeurs
          const statsRes = await api.get('/payments/employer/stats');
          setStats(statsRes.data.data);
        }
        
        // Vérifier que les données reçues sont bien un tableau
        if (paymentsRes && paymentsRes.data && paymentsRes.data.data && Array.isArray(paymentsRes.data.data)) {
          setPayments(paymentsRes.data.data);
        } else {
          console.error('Les données de paiements reçues ne sont pas un tableau:', paymentsRes);
          setPayments([]);
          setError('Format de données incorrect. Veuillez contacter le support.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des paiements:', err);
        setError('Impossible de charger les paiements');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Mettre à jour le statut d'un paiement
  const handleUpdateStatus = async (paymentId, status) => {
    try {
      await api.put(`/payments/${paymentId}/status`, { status, paymentDate: new Date() });
      
      // Mettre à jour l'état local
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, status } : payment
      ));
      
      toast.success(`Paiement marqué comme ${status.toLowerCase()}`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut du paiement:', err);
      toast.error('Impossible de mettre à jour le statut du paiement');
    }
  };

  // Filtrer les paiements par statut
  const getFilteredPayments = () => {
    if (tabValue === 0) return payments;
    
    const statusMap = {
      1: 'En attente',
      2: 'Traité',
      3: 'Payé'
    };
    
    return payments.filter(payment => payment.status === statusMap[tabValue]);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center">
          Veuillez vous connecter pour accéder à vos paiements
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Mes Paiements
      </Typography>
      
      {/* Statistiques pour les employeurs */}
      {user.userType === 'etablissement' && stats && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Résumé des paiements</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ minWidth: 200, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="body2">Total des paiements</Typography>
              <Typography variant="h5">{stats.total.total || 0} MAD</Typography>
              <Typography variant="caption">{stats.total.count || 0} paiements</Typography>
            </Box>
            
            <Box sx={{ minWidth: 200, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2">En attente</Typography>
              <Typography variant="h5">
                {stats.byStatus.find(s => s._id === 'En attente')?.total || 0} MAD
              </Typography>
              <Typography variant="caption">
                {stats.byStatus.find(s => s._id === 'En attente')?.count || 0} paiements
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: 200, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2">En cours de traitement</Typography>
              <Typography variant="h5">
                {stats.byStatus.find(s => s._id === 'Traité')?.total || 0} MAD
              </Typography>
              <Typography variant="caption">
                {stats.byStatus.find(s => s._id === 'Traité')?.count || 0} paiements
              </Typography>
            </Box>
            
            <Box sx={{ minWidth: 200, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="body2">Payés</Typography>
              <Typography variant="h5">
                {stats.byStatus.find(s => s._id === 'Payé')?.total || 0} MAD
              </Typography>
              <Typography variant="caption">
                {stats.byStatus.find(s => s._id === 'Payé')?.count || 0} paiements
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Tous" />
          <Tab label="En attente" />
          <Tab label="En traitement" />
          <Tab label="Payés" />
        </Tabs>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          {getFilteredPayments().length === 0 ? (
            <Typography align="center" sx={{ p: 3 }}>
              Aucun paiement trouvé dans cette catégorie
            </Typography>
          ) : (
            getFilteredPayments().map(payment => (
              <PaymentCard 
                key={payment._id} 
                payment={payment} 
                onUpdateStatus={user.userType === 'etablissement' ? handleUpdateStatus : null}
              />
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default PaymentsPage;
