import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, CircularProgress, Alert, Paper } from '@mui/material';
import RatingsList from '../components/ratings/RatingsList';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const RatingsPage = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [receivedRatings, setReceivedRatings] = useState([]);
  const [givenRatings, setGivenRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les u00e9valuations
  useEffect(() => {
    const fetchRatings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // u00c9valuations reu00e7ues
        const receivedRes = await api.get('/ratings/received');
        setReceivedRatings(receivedRes.data.data);
        setAverageRating(receivedRes.data.averageRating);
        setTotalRatings(receivedRes.data.totalRatings);
        
        // u00c9valuations donnu00e9es
        const givenRes = await api.get('/ratings/given');
        setGivenRatings(givenRes.data.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des u00e9valuations:', err);
        setError('Impossible de charger les u00e9valuations');
        setLoading(false);
      }
    };

    fetchRatings();
  }, [user]);

  // Gu00e9rer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center">
          Veuillez vous connecter pour accu00e9der u00e0 vos u00e9valuations
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Mes u00c9valuations
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="u00c9valuations reu00e7ues" />
          <Tab label="u00c9valuations donnu00e9es" />
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
          {tabValue === 0 && (
            <RatingsList 
              ratings={receivedRatings} 
              averageRating={averageRating} 
              totalRatings={totalRatings} 
            />
          )}
          {tabValue === 1 && (
            <RatingsList 
              ratings={givenRatings} 
              averageRating={0} 
              totalRatings={givenRatings.length} 
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default RatingsPage;
