import React from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { toast } from 'react-toastify';

// Page de test pour la création d'offres d'emploi
const TestJobCreation = () => {
  const handleTestJobCreation = () => {
    // Données de test avec les valeurs exactes du modèle MongoDB
    const debugData = {
      title: 'Test simple',
      description: 'Description simple pour tester l\'API avec au moins 50 caractères pour passer la validation.',
      contractType: 'CDI',
      sector: 'Restauration',
      // IMPORTANT: Utilisation de la valeur EXACTE du modèle MongoDB
      experienceLevel: 'Du00e9butant',
      location: {
        city: 'Casablanca'
      },
      salary: {
        amount: 5000,
        period: 'Mois',
        currency: 'MAD'
      },
      startDate: new Date().toISOString(),
      requiredSkills: ['Service client'],
      workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    };
    
    console.log('Données de test:', JSON.stringify(debugData, null, 2));
    
    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous n\'êtes pas connecté. Veuillez vous connecter pour tester.');
      return;
    }
    
    // Envoi direct via fetch
    fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(debugData)
    })
    .then(response => {
      console.log('Statut de la réponse:', response.status);
      return response.text().then(text => {
        try {
          return { status: response.status, data: JSON.parse(text) };
        } catch (e) {
          return { status: response.status, data: text };
        }
      });
    })
    .then(({ status, data }) => {
      console.log(`Réponse du serveur (${status}):`, data);
      if (status === 201 || status === 200) {
        toast.success('Test réussi: Offre créée avec succès!');
      } else {
        const errorMessage = data.message || data.error || (typeof data === 'string' ? data : 'Erreur inconnue');
        toast.error(`Test échoué (${status}): ${errorMessage}`);
      }
    })
    .catch(error => {
      console.error('Erreur lors du test:', error);
      toast.error(`Erreur lors du test: ${error.message}`);
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test de création d'offre d'emploi
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Cette page permet de tester la création d'une offre d'emploi avec les valeurs exactes attendues par le modèle MongoDB.
      </Alert>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" gutterBottom>
          Le test enverra une offre d'emploi avec les valeurs suivantes :
        </Typography>
        
        <ul>
          <li><strong>Titre:</strong> Test simple</li>
          <li><strong>Description:</strong> Description simple pour tester l'API</li>
          <li><strong>Type de contrat:</strong> CDI</li>
          <li><strong>Secteur:</strong> Restauration</li>
          <li><strong>Niveau d'expérience:</strong> Du00e9butant (valeur exacte du modèle)</li>
          <li><strong>Ville:</strong> Casablanca</li>
          <li><strong>Salaire:</strong> 5000 MAD/Mois</li>
        </ul>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleTestJobCreation}
          sx={{ mt: 2 }}
        >
          Tester la création d'offre
        </Button>
      </Box>
    </Container>
  );
};

export default TestJobCreation;
