import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Rating,
  Stack,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const FeedbackForm = ({ onSubmit, loading, userType }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);

  const handleSubmit = () => {
    if (rating === 0) return;
    
    onSubmit({
      rating,
      comment,
    });
  };

  const labels = {
    1: 'Très insatisfait',
    2: 'Insatisfait',
    3: 'Neutre',
    4: 'Satisfait',
    5: 'Très satisfait',
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {userType === 'candidat' 
          ? 'Évaluer l\'établissement' 
          : 'Évaluer le candidat'}
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography component="legend" gutterBottom>
          Note
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Rating
            name="feedback-rating"
            value={rating}
            precision={1}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {rating !== null && (
            <Typography variant="body2">
              {labels[hover !== -1 ? hover : rating]}
            </Typography>
          )}
        </Stack>
      </Box>
      <TextField
        fullWidth
        label="Commentaire"
        multiline
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading || rating === 0}
      >
        {loading ? <CircularProgress size={24} /> : 'Soumettre l\'évaluation'}
      </Button>
    </Paper>
  );
};

export default FeedbackForm;
