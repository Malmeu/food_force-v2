import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

const PaymentModal = ({ open, onClose, onSuccess, jobData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const steps = ['Sélection du forfait', 'Paiement', 'Confirmation'];

  // Plans d'abonnement
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Forfait Basic',
      price: 99,
      duration: '7 jours',
      features: [
        'Publication d\'une offre d\'emploi',
        'Visibilité standard',
        'Accès aux candidatures pendant 7 jours'
      ]
    },
    {
      id: 'premium',
      name: 'Forfait Premium',
      price: 299,
      duration: '30 jours',
      features: [
        'Publication d\'une offre d\'emploi',
        'Visibilité améliorée',
        'Mise en avant dans les résultats de recherche',
        'Accès aux candidatures pendant 30 jours',
        'Statistiques de consultation'
      ]
    }
  ];

  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    setLoading(true);
    setError('');

    // Simulation d'un appel API de paiement
    setTimeout(() => {
      setLoading(false);
      
      // Validation factice des informations de carte
      if (cardNumber && cardNumber.length >= 16 && expiryDate && cvv && cardholderName) {
        setSuccess(true);
        handleNext();
      } else {
        setError('Veuillez remplir correctement tous les champs de paiement.');
      }
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess(selectedPlan);
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Choisissez votre forfait
            </Typography>
            <Grid container spacing={2}>
              {subscriptionPlans.map((plan) => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedPlan.id === plan.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
                    }}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        {plan.name}
                      </Typography>
                      <Typography variant="h4" sx={{ my: 2 }}>
                        {plan.price} MAD
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Durée: {plan.duration}
                      </Typography>
                      <Divider sx={{ my: 1.5 }} />
                      <Box>
                        {plan.features.map((feature, index) => (
                          <Typography key={index} variant="body2" sx={{ py: 0.5 }}>
                            • {feature}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations de paiement
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Méthode de paiement
              </Typography>
              <RadioGroup
                row
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value="card" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      <span>Carte bancaire</span>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'card' && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Numéro de carte"
                      variant="outlined"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').substring(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 16 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date d'expiration (MM/AA)"
                      variant="outlined"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        if (value.length <= 4) {
                          if (value.length > 2) {
                            setExpiryDate(value.substring(0, 2) + '/' + value.substring(2));
                          } else {
                            setExpiryDate(value);
                          }
                        }
                      }}
                      placeholder="MM/AA"
                      inputProps={{ maxLength: 5 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      variant="outlined"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^\d]/g, '').substring(0, 3))}
                      placeholder="123"
                      inputProps={{ maxLength: 3 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nom du titulaire"
                      variant="outlined"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="NOM PRÉNOM"
                      required
                    />
                  </Grid>
                </Grid>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                
                <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Récapitulatif
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{selectedPlan.name}</Typography>
                    <Typography variant="body1">{selectedPlan.price} MAD</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">{selectedPlan.price} MAD</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: green[500], mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Paiement réussi !
            </Typography>
            <Typography variant="body1" paragraph>
              Votre offre d'emploi a été publiée avec succès.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Un reçu a été envoyé à votre adresse e-mail.
            </Typography>
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'left' }}>
              <Typography variant="subtitle1" gutterBottom>
                Détails de la transaction
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Forfait:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedPlan.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Montant:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {selectedPlan.price} MAD
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Date:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Référence:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    FF-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={activeStep === 2 ? onClose : null}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ mr: 1 }} />
          Publication d'offre d'emploi
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {renderStepContent(activeStep)}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
        {activeStep !== 2 && (
          <Button
            onClick={activeStep === 0 ? onClose : handleBack}
            variant="outlined"
          >
            {activeStep === 0 ? 'Annuler' : 'Retour'}
          </Button>
        )}
        
        {activeStep === 0 && (
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
          >
            Continuer
          </Button>
        )}
        
        {activeStep === 1 && (
          <Button
            onClick={handlePayment}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Payer'}
          </Button>
        )}
        
        {activeStep === 2 && (
          <Button
            onClick={handleFinish}
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
          >
            Terminer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
