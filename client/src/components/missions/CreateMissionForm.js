import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaSave, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';

const CreateMissionForm = ({ applicationId, onMissionCreated, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchApplicationData = async () => {
      try {
        const response = await api.get(`/applications/${applicationId}`);
        setApplicationData(response.data.data);
      } catch (err) {
        console.error('Erreur lors du chargement des données de la candidature:', err);
        setError('Impossible de charger les données de la candidature.');
      }
    };

    fetchApplicationData();
  }, [applicationId]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/missions', {
        title: data.title,
        description: data.description,
        candidateId: applicationData.candidate._id,
        applicationId,
        startDate: data.startDate,
        endDate: data.endDate,
        hourlyRate: parseFloat(data.hourlyRate),
        estimatedHours: parseFloat(data.estimatedHours),
        priority: data.priority,
        notes: data.notes
      });
      
      setLoading(false);
      
      if (onMissionCreated) {
        onMissionCreated(response.data.data);
      }
      
    } catch (err) {
      console.error('Erreur lors de la cru00e9ation de la mission:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la cru00e9ation de la mission');
      setLoading(false);
    }
  };

  if (!applicationData) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Cru00e9er une nouvelle mission</h5>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={onCancel}
        >
          <FaTimes /> Annuler
        </button>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Titre de la mission</label>
            <input 
              type="text" 
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              id="title"
              placeholder="Ex: Du00e9veloppement d'une nouvelle recette"
              {...register('title', { 
                required: 'Le titre est requis',
                maxLength: { value: 100, message: 'Maximum 100 caractu00e8res' }
              })}
            />
            {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description de la mission</label>
            <textarea 
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              id="description"
              rows="4"
              placeholder="Du00e9crivez les objectifs et les tu00e2ches de la mission..."
              {...register('description', { 
                required: 'La description est requise',
                minLength: { value: 50, message: 'Minimum 50 caractu00e8res' },
                maxLength: { value: 1000, message: 'Maximum 1000 caractu00e8res' }
              })}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="startDate" className="form-label">Date de du00e9but</label>
              <input 
                type="date" 
                className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                id="startDate"
                {...register('startDate', { required: 'La date de du00e9but est requise' })}
              />
              {errors.startDate && <div className="invalid-feedback">{errors.startDate.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="endDate" className="form-label">Date de fin</label>
              <input 
                type="date" 
                className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                id="endDate"
                {...register('endDate', { required: 'La date de fin est requise' })}
              />
              {errors.endDate && <div className="invalid-feedback">{errors.endDate.message}</div>}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="hourlyRate" className="form-label">Taux horaire (MAD)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
                id="hourlyRate"
                placeholder="Ex: 100"
                {...register('hourlyRate', { 
                  required: 'Le taux horaire est requis',
                  min: { value: 0, message: 'Le taux horaire doit u00eatre positif' }
                })}
              />
              {errors.hourlyRate && <div className="invalid-feedback">{errors.hourlyRate.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="estimatedHours" className="form-label">Heures estimu00e9es</label>
              <input 
                type="number" 
                step="0.5"
                min="0.5"
                className={`form-control ${errors.estimatedHours ? 'is-invalid' : ''}`}
                id="estimatedHours"
                placeholder="Ex: 40"
                {...register('estimatedHours', { 
                  required: 'Le nombre d\'heures estimu00e9es est requis',
                  min: { value: 0.5, message: 'Minimum 0.5 heure' }
                })}
              />
              {errors.estimatedHours && <div className="invalid-feedback">{errors.estimatedHours.message}</div>}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">Prioritu00e9</label>
            <select 
              className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
              id="priority"
              {...register('priority', { required: 'La prioritu00e9 est requise' })}
            >
              <option value="">Su00e9lectionner une prioritu00e9</option>
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
            {errors.priority && <div className="invalid-feedback">{errors.priority.message}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Notes additionnelles</label>
            <textarea 
              className="form-control"
              id="notes"
              rows="3"
              placeholder="Informations compu00e9mentaires sur la mission..."
              {...register('notes')}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <h6>Candidat assignu00e9</h6>
            <p className="form-control-static">
              {applicationData.candidate.candidateProfile?.firstName} {applicationData.candidate.candidateProfile?.lastName}
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cru00e9ation en cours...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Cru00e9er la mission
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMissionForm;
