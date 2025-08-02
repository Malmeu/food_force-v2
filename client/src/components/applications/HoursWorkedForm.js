import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import frLocale from 'date-fns/locale/fr';

const HoursWorkedForm = ({ onSubmit, loading }) => {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validation
    if (!hours || isNaN(hours) || parseFloat(hours) <= 0) {
      setError('Veuillez entrer un nombre d\'heures valide');
      return;
    }

    setError('');
    onSubmit({
      date: date.toISOString(),
      hours: parseFloat(hours),
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enregistrer les heures travaillées
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nombre d'heures"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{ inputProps: { min: 0, step: 0.5 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Enregistrer'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HoursWorkedForm;
