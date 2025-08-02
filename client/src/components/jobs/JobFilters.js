import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const JobFilters = ({ filters, onFilterChange, onResetFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <Card sx={{ mb: 4, p: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Filtres de recherche
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="search"
              label="Rechercher par mot-clu00e9"
              value={filters.search}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sector-label">Secteur</InputLabel>
              <Select
                labelId="sector-label"
                name="sector"
                value={filters.sector}
                label="Secteur"
                onChange={handleChange}
              >
                <MenuItem value="">Tous les secteurs</MenuItem>
                <MenuItem value="Restauration">Restauration</MenuItem>
                <MenuItem value="Hu00f4tellerie">Hu00f4tellerie</MenuItem>
                <MenuItem value="u00c9vu00e9nementiel">u00c9vu00e9nementiel</MenuItem>
                <MenuItem value="Vente">Vente</MenuItem>
                <MenuItem value="Logistique">Logistique</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="contract-type-label">Type de contrat</InputLabel>
              <Select
                labelId="contract-type-label"
                name="contractType"
                value={filters.contractType}
                label="Type de contrat"
                onChange={handleChange}
              >
                <MenuItem value="">Tous les contrats</MenuItem>
                <MenuItem value="CDI">CDI</MenuItem>
                <MenuItem value="CDD">CDD</MenuItem>
                <MenuItem value="Intu00e9rim">Intu00e9rim</MenuItem>
                <MenuItem value="Extra">Extra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="city"
              label="Ville"
              value={filters.city}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onResetFilters}
              fullWidth
              sx={{ height: '100%' }}
            >
              Ru00e9initialiser les filtres
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobFilters;
