import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaClock, FaSave } from 'react-icons/fa';

const RecordWorkHoursForm = ({ missionId, onRecordSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await axios.post('/api/workhours', {
        missionId,
        date: data.date,
        hours: parseFloat(data.hours),
        description: data.description
      });
      
      setSuccess(true);
      setLoading(false);
      reset();
      
      if (onRecordSuccess) {
        onRecordSuccess(response.data.data);
      }
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement des heures:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement des heures travaillées');
      setLoading(false);
    }
  };

  return (
    <div className="work-hours-form mb-4">
      <h4 className="mb-3"><FaClock className="me-2" /> Enregistrer des heures travaillées</h4>
      
      {success && (
        <div className="alert alert-success" role="alert">
          Heures travaillées enregistrées avec succès!
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input 
              type="date" 
              className={`form-control ${errors.date ? 'is-invalid' : ''}`}
              id="date"
              {...register('date', { required: 'La date est requise' })}
            />
            {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="hours" className="form-label">Nombre d'heures</label>
            <input 
              type="number" 
              step="0.5"
              min="0.5"
              max="24"
              className={`form-control ${errors.hours ? 'is-invalid' : ''}`}
              id="hours"
              placeholder="Ex: 8"
              {...register('hours', { 
                required: 'Le nombre d\'heures est requis',
                min: { value: 0.5, message: 'Minimum 0.5 heure' },
                max: { value: 24, message: 'Maximum 24 heures' }
              })}
            />
            {errors.hours && <div className="invalid-feedback">{errors.hours.message}</div>}
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description des tâches effectuées</label>
          <textarea 
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            id="description"
            rows="3"
            placeholder="Décrivez les tâches que vous avez effectuées..."
            {...register('description', { 
              required: 'La description est requise',
              maxLength: { value: 500, message: 'Maximum 500 caractères' }
            })}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <FaSave className="me-2" /> Enregistrer les heures
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default RecordWorkHoursForm;
