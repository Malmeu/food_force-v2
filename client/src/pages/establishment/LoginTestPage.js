import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginTestPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Tentative de connexion
      console.log('Tentative de connexion avec:', { email });
      const user = await login(email, password);
      
      // Récupérer le token après la connexion
      const token = localStorage.getItem('token');
      if (token) {
        setTokenInfo(`Token présent: ${token.substring(0, 20)}...`);
        console.log('Connexion réussie, token:', token);
      } else {
        setTokenInfo('Aucun token trouvé après la connexion');
        console.warn('Connexion réussie mais aucun token trouvé');
      }
      
      // Redirection après un délai
      setTimeout(() => {
        navigate('/establishment/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };
  
  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setTokenInfo(`Token actuel: ${token.substring(0, 20)}...`);
      console.log('Token actuel:', token);
    } else {
      setTokenInfo('Aucun token trouvé');
      console.warn('Aucun token trouvé');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Test de Connexion
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {tokenInfo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {tokenInfo}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={checkToken}
            >
              Vérifier Token
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginTestPage;
