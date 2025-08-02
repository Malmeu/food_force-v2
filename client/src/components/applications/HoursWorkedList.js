import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

const HoursWorkedList = ({ hoursWorked, onValidateHours, loading, userType }) => {
  if (!hoursWorked || hoursWorked.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Heures travaillu00e9es
        </Typography>
        <Typography variant="body1">
          Aucune heure travaillu00e9e n'a u00e9tu00e9 enregistru00e9e pour cette mission.
        </Typography>
      </Paper>
    );
  }

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spu00e9cifiu00e9';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Heures travaillu00e9es
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Heures</TableCell>
              <TableCell>Validu00e9 par l'employeur</TableCell>
              <TableCell>Validu00e9 par le candidat</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoursWorked.map((hour) => (
              <TableRow key={hour._id}>
                <TableCell>{formatDate(hour.date)}</TableCell>
                <TableCell>{hour.hours}</TableCell>
                <TableCell>
                  {hour.validated.byEmployer ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Validu00e9"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<PendingIcon />}
                      label="En attente"
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {hour.validated.byCandidate ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Validu00e9"
                      color="success"
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<PendingIcon />}
                      label="En attente"
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {userType === 'candidat' && !hour.validated.byCandidate && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onValidateHours(hour._id)}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Valider'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default HoursWorkedList;
