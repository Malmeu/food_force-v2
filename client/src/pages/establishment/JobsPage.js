import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Chip, Button, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';
import { jobsAPI } from '../../utils/api';

// Composant pour afficher une offre d'emploi
const JobItem = ({ job, onEdit, onDelete, onToggleStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(job);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(job);
  };

  const handleToggleStatus = () => {
    handleClose();
    onToggleStatus(job);
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Conversion du statut pour affichage
  const getStatusLabel = () => {
    switch (job.status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'draft':
        return 'Brouillon';
      default:
        return 'Inconnu';
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'draft':
        return 'Brouillon';
      default:
        return 'Inconnue';
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Chip 
              label={getStatusText()} 
              color={getStatusColor()} 
              size="small" 
              sx={{ ml: 2 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {job.location && typeof job.location === 'object' ? job.location.city || 'Non spécifié' : job.location || 'Non spécifié'} • {job.contractType} • {job.salary && typeof job.salary === 'object' ? `${job.salary.amount} ${job.salary.currency}/${job.salary.period}` : job.salary || 'Non spécifié'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {job.description.length > 150 ? `${job.description.substring(0, 150)}...` : job.description}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((skill, index) => (
                <Chip key={index} label={skill} size="small" variant="outlined" />
              ))
            ) : (
              job.requiredSkills && job.requiredSkills.length > 0 ? (
                job.requiredSkills.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" variant="outlined" />
                ))
              ) : null
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="body2" color="primary">
              {job.applicationsCount} candidature(s)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Publié le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              component={Link}
              to={`/jobs/${job._id}`}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            >
              Voir
            </Button>
            <IconButton
              aria-label="plus d'options"
              aria-controls={open ? 'job-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="job-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'job-options-button',
              }}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Modifier
              </MenuItem>
              <MenuItem onClick={handleToggleStatus}>
                {job.status === 'active' ? (
                  <>
                    <VisibilityOffIcon fontSize="small" sx={{ mr: 1 }} />
                    Du00e9sactiver
                  </>
                ) : (
                  <>
                    <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                    Activer
                  </>
                )}
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Supprimer
              </MenuItem>
            </Menu>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const JobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        console.log('Récupération des offres de l\'employeur connecté...');
        
        // Utilisation de l'API pour récupérer les offres d'emploi de l'employeur connecté
        const response = await jobsAPI.getEmployerJobs();
        
        // Extraction des données avec gestion robuste des différents formats de réponse
        let jobsData = [];
        
        if (response && response.data) {
          console.log('Données des offres reçues:', response.data);
          
          // Format standard: { success: true, data: [...] }
          if (response.data.success && Array.isArray(response.data.data)) {
            jobsData = response.data.data;
            console.log(`Format standard: ${jobsData.length} offres trouvées`);
          } 
          // Format alternatif: tableau direct
          else if (Array.isArray(response.data)) {
            jobsData = response.data;
            console.log(`Format tableau: ${jobsData.length} offres trouvées`);
          }
          // Format alternatif: { data: [...] } sans success
          else if (response.data.data && Array.isArray(response.data.data)) {
            jobsData = response.data.data;
            console.log(`Format data sans success: ${jobsData.length} offres trouvées`);
          }
          // Cas où une seule offre est retournée comme objet
          else if (response.data._id) {
            jobsData = [response.data];
            console.log('Une seule offre trouvée (format objet)');
          }
          // Cas où la réponse est un objet avec des offres comme propriétés
          else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
            // Essayer de trouver des offres dans l'objet
            const possibleJobs = Object.values(response.data).filter(item => 
              item && typeof item === 'object' && item._id && item.title
            );
            
            if (possibleJobs.length > 0) {
              jobsData = possibleJobs;
              console.log(`Format objet complexe: ${jobsData.length} offres trouvées`);
            }
          }
        }
        
        // Tri des offres par date de création (plus récentes en premier)
        jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Toujours définir jobs comme un tableau (même vide)
        setJobs(jobsData);
        console.log('Nombre total d\'offres chargées:', jobsData.length);
        
        // Afficher les IDs des offres pour faciliter le débogage
        if (jobsData.length > 0) {
          console.log('IDs des offres chargées:', jobsData.map(job => job._id));
        }
        
        // Ne pas afficher d'erreur si c'est juste que l'utilisateur n'a pas encore d'offres
        if (jobsData.length === 0) {
          console.log('Aucune offre trouvée pour cet établissement');
          // Pas d'erreur à afficher, c'est un cas normal
          setError('');
        } else {
          // Offres trouvées, pas d'erreur à afficher
          setError('');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des offres d\'emploi:', err);
        
        // Afficher un message d'erreur plus détaillé si possible
        const errorMessage = err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Impossible de charger vos offres d\'emploi. Veuillez réessayer plus tard.';
        
        setError(errorMessage);
        setJobs([]);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEditJob = (job) => {
    // Redirection vers la page de modification de l'offre
    window.location.href = `/establishment/jobs/edit/${job._id}`;
  };

  const handleDeleteDialogOpen = (job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      // Appel API pour supprimer l'offre
      await jobsAPI.deleteJob(selectedJob._id);
      setJobs(jobs.filter(job => job._id !== selectedJob._id));
      
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'offre:', err);
      setError('Impossible de supprimer l\'offre. Veuillez réessayer plus tard.');
      handleDeleteDialogClose();
    }
  };

  const handleToggleJobStatus = async (job) => {
    try {
      const newStatus = job.status === 'active' ? 'inactive' : 'active';
      
      // Appel API pour modifier le statut de l'offre
      await jobsAPI.updateJob(job._id, { status: newStatus });
      setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error('Erreur lors de la modification du statut de l\'offre:', err);
      setError('Impossible de modifier le statut de l\'offre. Veuillez réessayer plus tard.');
    }
  };

  const getActiveJobsCount = () => jobs.filter(job => job.status === 'active').length;
  const getInactiveJobsCount = () => jobs.filter(job => job.status === 'inactive').length;
  const getDraftJobsCount = () => jobs.filter(job => job.status === 'draft').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Gestion des offres d'emploi
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {jobs.length} offre(s) d'emploi au total • {getActiveJobsCount()} active(s) • {getInactiveJobsCount()} inactive(s) • {getDraftJobsCount()} brouillon(s)
          </Typography>
        </div>
        <Button
          component={Link}
          to="/establishment/jobs/create"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Nouvelle offre
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Paper>
      ) : jobs.length > 0 ? (
        jobs.map(job => (
          <JobItem
            key={job._id}
            job={job}
            onEdit={handleEditJob}
            onDelete={handleDeleteDialogOpen}
            onToggleStatus={handleToggleJobStatus}
          />
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Vous n'avez pas encore publiu00e9 d'offres d'emploi.
          </Typography>
          <Button
            component={Link}
            to="/establishment/jobs/create"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Publier votre premiu00e8re offre
          </Button>
        </Paper>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            u00cates-vous su00fbr de vouloir supprimer l'offre "{selectedJob?.title}" ? Cette action est irru00e9versible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Annuler</Button>
          <Button onClick={handleDeleteJob} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsPage;
