import React, { useState } from 'react';
import { Box, Typography, Rating, TextField, Button, Chip, Alert, CircularProgress, Paper } from '@mui/material';
import { Star } from '@mui/icons-material';
import api from '../../utils/api';

const RatingForm = ({ applicationId, ratingType, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [skills, setSkills] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Soumettre l'évaluation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez attribuer une note');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const ratingData = {
        applicationId,
        rating,
        comment,
        ratingType
      };
      
      // Ajouter les compétences ou critères selon le type d'évaluation
      if (ratingType === 'establishment_to_candidate' && skills.length > 0) {
        ratingData.skills = skills;
      } else if (ratingType === 'candidate_to_establishment' && criteria.length > 0) {
        ratingData.criteria = criteria;
      }
      
      const res = await api.post('/ratings', ratingData);
      
      setSuccess(true);
      setLoading(false);
      
      // Notifier le parent que l'évaluation a été soumise
      if (onRatingSubmitted) {
        onRatingSubmitted(res.data.data);
      }
    } catch (err) {
      console.error('Erreur lors de la soumission de l\'évaluation:', err);
      setError(err.response?.data?.message || 'Impossible de soumettre l\'évaluation');
      setLoading(false);
    }
  };

  // Ajouter une compétence pour l'évaluation d'un candidat
  const handleAddSkill = (skill) => {
    if (skill.name && skill.rating > 0) {
      setSkills([...skills, skill]);
    }
  };

  // Ajouter un critère pour l'évaluation d'un établissement
  const handleAddCriterion = (criterion) => {
    if (criterion.name && criterion.rating > 0) {
      setCriteria([...criteria, criterion]);
    }
  };

  // Supprimer une compétence
  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Supprimer un critère
  const handleRemoveCriterion = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        Votre évaluation a été soumise avec succès !
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {ratingType === 'establishment_to_candidate' 
          ? 'Évaluer le candidat' 
          : 'Évaluer l\'établissement'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography component="legend">Note globale</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={1}
            size="large"
            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Commentaire"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
          />
        </Box>
        
        {/* Évaluation des compétences pour un candidat */}
        {ratingType === 'establishment_to_candidate' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Compétences
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill.name}: ${skill.rating}/5`}
                  onDelete={() => handleRemoveSkill(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="Compétence"
                size="small"
                id="skill-name"
                sx={{ flexGrow: 1 }}
              />
              <Rating
                name="skill-rating"
                defaultValue={0}
                precision={1}
                size="small"
                id="skill-rating"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const skillName = document.getElementById('skill-name').value;
                  const skillRating = parseInt(document.getElementById('skill-rating').value, 10);
                  if (skillName && skillRating) {
                    handleAddSkill({ name: skillName, rating: skillRating });
                    document.getElementById('skill-name').value = '';
                    document.getElementById('skill-rating').value = '0';
                  }
                }}
              >
                Ajouter
              </Button>
            </Box>
          </Box>
        )}
        
        {/* Évaluation des critères pour un établissement */}
        {ratingType === 'candidate_to_establishment' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Critères d'évaluation
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {criteria.map((criterion, index) => (
                <Chip
                  key={index}
                  label={`${criterion.name}: ${criterion.rating}/5`}
                  onDelete={() => handleRemoveCriterion(index)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                label="Critère"
                size="small"
                id="criterion-name"
                sx={{ flexGrow: 1 }}
              />
              <Rating
                name="criterion-rating"
                defaultValue={0}
                precision={1}
                size="small"
                id="criterion-rating"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const criterionName = document.getElementById('criterion-name').value;
                  const criterionRating = parseInt(document.getElementById('criterion-rating').value, 10);
                  if (criterionName && criterionRating) {
                    handleAddCriterion({ name: criterionName, rating: criterionRating });
                    document.getElementById('criterion-name').value = '';
                    document.getElementById('criterion-rating').value = '0';
                  }
                }}
              >
                Ajouter
              </Button>
            </Box>
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || rating === 0}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Soumission en cours...' : 'Soumettre l\'évaluation'}
        </Button>
      </form>
    </Paper>
  );
};

export default RatingForm;
