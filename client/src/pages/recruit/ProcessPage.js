import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  useTheme,
  alpha,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ProcessPage = () => {
  const theme = useTheme();

  const recruitmentSteps = [
    {
      label: 'Publication de l\'offre',
      description: 'Créez et publiez votre offre d\'emploi en quelques clics. Précisez vos besoins, les compétences requises et les conditions de travail.',
      icon: <AssignmentIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Présélection des candidats',
      description: 'Notre algorithme analyse les profils et vous propose les candidats les plus pertinents pour votre offre. Vous pouvez également parcourir notre base de données.',
      icon: <SearchIcon />,
      color: theme.palette.secondary.main,
    },
    {
      label: 'Entretiens',
      description: 'Organisez des entretiens avec les candidats sélectionnés, en présentiel ou par visioconférence via notre plateforme intégrée.',
      icon: <PersonIcon />,
      color: '#2196f3', // blue
    },
    {
      label: 'Embauche',
      description: 'Finalisez le recrutement avec des contrats générés automatiquement et conformes à la législation en vigueur.',
      icon: <HandshakeIcon />,
      color: '#4caf50', // green
    },
  ];

  const benefits = [
    {
      title: 'Gain de temps',
      description: 'Réduisez de 70% le temps consacré au recrutement grâce à notre processus optimisé.',
      icon: <AccessTimeIcon fontSize="large" />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Qualité des candidats',
      description: 'Tous les profils sont vérifiés et évalués pour garantir leur adéquation avec vos besoins.',
      icon: <VerifiedUserIcon fontSize="large" />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Accompagnement personnalisé',
      description: 'Un conseiller dédié vous accompagne à chaque étape du processus de recrutement.',
      icon: <SupportAgentIcon fontSize="large" />,
      color: '#2196f3', // blue
    },
  ];

  return (
    <>
      {/* Introduction */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Notre processus de recrutement
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: '800px', mb: 4 }}>
          Food Force simplifie votre processus de recrutement grâce à une approche structurée et efficace. Découvrez comment nous vous aidons à trouver les meilleurs talents pour votre établissement.
        </Typography>
      </Box>

      {/* Étapes du recrutement */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 4, 
          mb: 8,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Les étapes clés
        </Typography>
        
        <Stepper orientation="vertical" sx={{ mt: 4 }}>
          {recruitmentSteps.map((step, index) => (
            <Step key={index} active={true}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: step.color,
                    '& .MuiStepIcon-text': {
                      fill: 'white',
                    },
                  }
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, mt: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(step.color, 0.1),
                      color: step.color,
                      mr: 2
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography variant="body1">
                    {step.description}
                  </Typography>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Avantages */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Les avantages de notre processus
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={2}
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    backgroundColor: benefit.color,
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(benefit.color, 0.1), 
                        color: benefit.color,
                        width: 64,
                        height: 64,
                        mr: 2
                      }}
                    >
                      {benefit.icon}
                    </Avatar>
                    <Typography variant="h5" component="h3" fontWeight="bold">
                      {benefit.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* FAQ */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Questions fréquentes
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Combien de temps dure le processus de recrutement ?
                </Typography>
                <Typography variant="body1" paragraph>
                  En moyenne, nos clients trouvent un candidat adapté en 48h. Le processus complet, de la publication de l'offre à la signature du contrat, peut prendre entre 3 et 7 jours selon vos disponibilités pour les entretiens.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Comment sont vérifiés les profils des candidats ?
                </Typography>
                <Typography variant="body1" paragraph>
                  Tous les candidats passent par un processus de vérification qui inclut la validation des références, des diplômes et des expériences professionnelles. Nous effectuons également des entretiens préliminaires pour évaluer leurs compétences.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Puis-je modifier mon offre d'emploi après sa publication ?
                </Typography>
                <Typography variant="body1" paragraph>
                  Oui, vous pouvez modifier votre offre à tout moment. Les modifications seront immédiatement prises en compte et visibles pour les candidats potentiels.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Comment se déroulent les entretiens via la plateforme ?
                </Typography>
                <Typography variant="body1" paragraph>
                  Notre plateforme intègre un outil de visioconférence sécurisé. Vous recevez un lien à partager avec le candidat, et vous pouvez mener l'entretien directement depuis votre compte Food Force. Toutes les sessions peuvent être enregistrées avec le consentement du candidat.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Témoignage */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 6,
          background: 'white',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: '4rem',
            color: alpha(theme.palette.primary.main, 0.2),
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
          }}
        >
          "
        </Box>
        
        <Box sx={{ pl: 4, pt: 2 }}>
          <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
            Grâce au processus de recrutement de Food Force, nous avons pu constituer une équipe complète pour l'ouverture de notre restaurant en seulement deux semaines. La qualité des candidats et l'efficacité du processus nous ont impressionnés.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <Avatar
              src="/images/testimonial1.jpg"
              alt="Mohammed Alami"
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Mohammed Alami
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Directeur, Restaurant Le Gourmet
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Appel à l'action */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Prêt à simplifier votre processus de recrutement ?
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Rejoignez les centaines d'établissements qui font confiance à Food Force pour trouver les meilleurs talents.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            borderRadius: 30,
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            }
          }}
        >
          Commencer gratuitement
        </Button>
      </Paper>
    </>
  );
};

export default ProcessPage;
