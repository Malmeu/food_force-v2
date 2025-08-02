import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';

const ApplicationStatusUpdate = ({ application, onUpdateStatus, loading }) => {
  const [status, setStatus] = useState(application?.status || 'En attente');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubmit = () => {
    onUpdateStatus(status);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Mettre à jour le statut de la candidature
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-label">Statut</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Statut"
            onChange={handleChange}
          >
            <MenuItem value="En attente">En attente</MenuItem>
            <MenuItem value="Examinée">Examinée</MenuItem>
            <MenuItem value="Entretien">Entretien</MenuItem>
            <MenuItem value="Acceptée">Acceptée</MenuItem>
            <MenuItem value="Refusée">Refusée</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || status === application?.status}
        >
          {loading ? <CircularProgress size={24} /> : 'Mettre à jour'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ApplicationStatusUpdate;
