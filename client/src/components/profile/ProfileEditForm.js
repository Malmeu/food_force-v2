import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';

const ProfileEditForm = ({ user, onSubmit, loading }) => {
  const [selectedSkills, setSelectedSkills] = useState(user?.candidateProfile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Schéma de validation pour les candidats
  const candidateValidationSchema = Yup.object({
    'candidateProfile.firstName': Yup.string().required('Le prénom est requis'),
    'candidateProfile.lastName': Yup.string().required('Le nom est requis'),
    'phone': Yup.string().required('Le numéro de téléphone est requis'),
    'address.city': Yup.string().required('La ville est requise'),
  });

  // Schéma de validation pour les établissements
  const establishmentValidationSchema = Yup.object({
    'establishmentProfile.name': Yup.string().required('Le nom de l\'établissement est requis'),
    'establishmentProfile.sector': Yup.string().required('Le secteur d\'activité est requis'),
    'phone': Yup.string().required('Le numéro de téléphone est requis'),
    'address.city': Yup.string().required('La ville est requise'),
  });

  // Initialiser les valeurs du formulaire
  const initialValues = {
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'Maroc',
    },
    candidateProfile: user?.userType === 'candidat' ? {
      firstName: user?.candidateProfile?.firstName || '',
      lastName: user?.candidateProfile?.lastName || '',
      birthDate: user?.candidateProfile?.birthDate ? new Date(user.candidateProfile.birthDate).toISOString().split('T')[0] : '',
      skills: user?.candidateProfile?.skills || [],
      preferredSectors: user?.candidateProfile?.preferredSectors || [],
      preferredContractTypes: user?.candidateProfile?.preferredContractTypes || [],
    } : {},
    establishmentProfile: user?.userType === 'etablissement' ? {
      name: user?.establishmentProfile?.name || '',
      description: user?.establishmentProfile?.description || '',
      sector: user?.establishmentProfile?.sector || '',
      companySize: user?.establishmentProfile?.companySize || '',
      website: user?.establishmentProfile?.website || '',
      contactPerson: {
        firstName: user?.establishmentProfile?.contactPerson?.firstName || '',
        lastName: user?.establishmentProfile?.contactPerson?.lastName || '',
        position: user?.establishmentProfile?.contactPerson?.position || '',
      },
    } : {},
  };

  // Configuration de Formik
  const formik = useFormik({
    initialValues,
    validationSchema: user?.userType === 'candidat' ? candidateValidationSchema : establishmentValidationSchema,
    onSubmit: (values) => {
      // Si c'est un candidat, mettre à jour les compétences
      if (user?.userType === 'candidat') {
        values.candidateProfile.skills = selectedSkills;
      }
      onSubmit(values);
    },
  });

  // Ajouter une compétence
  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Supprimer une compétence
  const handleDeleteSkill = (skillToDelete) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToDelete));
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Informations de base
        </Typography>
        <Grid container spacing={3}>
          {user?.userType === 'candidat' ? (
            // Champs pour les candidats
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.firstName"
                  name="candidateProfile.firstName"
                  label="Prénom"
                  value={formik.values.candidateProfile.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.candidateProfile?.firstName && Boolean(formik.errors.candidateProfile?.firstName)}
                  helperText={formik.touched.candidateProfile?.firstName && formik.errors.candidateProfile?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.lastName"
                  name="candidateProfile.lastName"
                  label="Nom"
                  value={formik.values.candidateProfile.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.candidateProfile?.lastName && Boolean(formik.errors.candidateProfile?.lastName)}
                  helperText={formik.touched.candidateProfile?.lastName && formik.errors.candidateProfile?.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="candidateProfile.birthDate"
                  name="candidateProfile.birthDate"
                  label="Date de naissance"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.candidateProfile.birthDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </>
          ) : (
            // Champs pour les établissements
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.name"
                  name="establishmentProfile.name"
                  label="Nom de l'établissement"
                  value={formik.values.establishmentProfile.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.establishmentProfile?.name && Boolean(formik.errors.establishmentProfile?.name)}
                  helperText={formik.touched.establishmentProfile?.name && formik.errors.establishmentProfile?.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.description"
                  name="establishmentProfile.description"
                  label="Description de l'établissement"
                  multiline
                  rows={4}
                  value={formik.values.establishmentProfile.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="sector-label">Secteur d'activité</InputLabel>
                  <Select
                    labelId="sector-label"
                    id="establishmentProfile.sector"
                    name="establishmentProfile.sector"
                    value={formik.values.establishmentProfile.sector}
                    label="Secteur d'activité"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.establishmentProfile?.sector && Boolean(formik.errors.establishmentProfile?.sector)}
                  >
                    <MenuItem value="Restauration">Restauration</MenuItem>
                    <MenuItem value="Hôtellerie">Hôtellerie</MenuItem>
                    <MenuItem value="Événementiel">Événementiel</MenuItem>
                    <MenuItem value="Vente">Vente</MenuItem>
                    <MenuItem value="Logistique">Logistique</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="company-size-label">Taille de l'entreprise</InputLabel>
                  <Select
                    labelId="company-size-label"
                    id="establishmentProfile.companySize"
                    name="establishmentProfile.companySize"
                    value={formik.values.establishmentProfile.companySize}
                    label="Taille de l'entreprise"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="1-10 employés">1-10 employés</MenuItem>
                    <MenuItem value="11-50 employés">11-50 employés</MenuItem>
                    <MenuItem value="51-200 employés">51-200 employés</MenuItem>
                    <MenuItem value="201+ employés">201+ employés</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="establishmentProfile.website"
                  name="establishmentProfile.website"
                  label="Site web"
                  value={formik.values.establishmentProfile.website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coordonnées
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Numéro de téléphone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address.street"
              name="address.street"
              label="Adresse"
              value={formik.values.address.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="address.city"
              name="address.city"
              label="Ville"
              value={formik.values.address.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
              helperText={formik.touched.address?.city && formik.errors.address?.city}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="address.postalCode"
              name="address.postalCode"
              label="Code postal"
              value={formik.values.address.postalCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
        </Grid>
      </Paper>

      {user?.userType === 'candidat' && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Compétences et préférences
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Compétences
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedSkills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleDeleteSkill(skill)}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Ajouter une compétence"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button variant="contained" onClick={handleAddSkill}>
                  Ajouter
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="preferred-sectors-label">Secteurs préférés</InputLabel>
                <Select
                  labelId="preferred-sectors-label"
                  id="candidateProfile.preferredSectors"
                  name="candidateProfile.preferredSectors"
                  multiple
                  value={formik.values.candidateProfile.preferredSectors}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Restauration">Restauration</MenuItem>
                  <MenuItem value="Hôtellerie">Hôtellerie</MenuItem>
                  <MenuItem value="Événementiel">Événementiel</MenuItem>
                  <MenuItem value="Vente">Vente</MenuItem>
                  <MenuItem value="Logistique">Logistique</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="preferred-contract-types-label">Types de contrats préférés</InputLabel>
                <Select
                  labelId="preferred-contract-types-label"
                  id="candidateProfile.preferredContractTypes"
                  name="candidateProfile.preferredContractTypes"
                  multiple
                  value={formik.values.candidateProfile.preferredContractTypes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="CDD">CDD</MenuItem>
                  <MenuItem value="Intérim">Intérim</MenuItem>
                  <MenuItem value="Extra">Extra</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {user?.userType === 'etablissement' && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Personne de contact
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="establishmentProfile.contactPerson.firstName"
                name="establishmentProfile.contactPerson.firstName"
                label="Prénom"
                value={formik.values.establishmentProfile.contactPerson.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="establishmentProfile.contactPerson.lastName"
                name="establishmentProfile.contactPerson.lastName"
                label="Nom"
                value={formik.values.establishmentProfile.contactPerson.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="establishmentProfile.contactPerson.position"
                name="establishmentProfile.contactPerson.position"
                label="Poste"
                value={formik.values.establishmentProfile.contactPerson.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ minWidth: 200 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Enregistrer les modifications'}
        </Button>
      </Box>
    </form>
  );
};

export default ProfileEditForm;
