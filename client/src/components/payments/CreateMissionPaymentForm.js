import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaSave, FaTimes } from 'react-icons/fa';

const CreateMissionPaymentForm = ({ missionId, onPaymentCreated, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missionData, setMissionData] = useState(null);
  const [validatedHours, setValidatedHours] = useState(0);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const watchHoursWorked = watch('hoursWorked', 0);
  const watchHourlyRate = watch('hourlyRate', 0);

  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        const response = await axios.get(`/api/missions/${missionId}`);
        setMissionData(response.data.data);
        setValue('hourlyRate', response.data.data.hourlyRate);
        
        // Ru00e9cupu00e9rer les heures validu00e9es
        const hoursResponse = await axios.get(`/api/workhours/mission/${missionId}`);
        const validatedHoursTotal = hoursResponse.data.data
          .filter(item => item.status === 'validu00e9')
          .reduce((sum, item) => sum + item.hours, 0);
        
        setValidatedHours(validatedHoursTotal);
      } catch (err) {
        console.error('Erreur lors du chargement des donnu00e9es de la mission:', err);
        setError('Impossible de charger les donnu00e9es de la mission.');
      }
    };

    fetchMissionData();
  }, [missionId, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/payments/mission', {
        missionId,
        amount: parseFloat(data.amount),
        hoursWorked: parseFloat(data.hoursWorked),
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        paymentMethod: data.paymentMethod,
        paymentDetails: {
          notes: data.notes,
          bankAccount: data.bankAccount,
          checkNumber: data.checkNumber
        },
        dueDate: data.dueDate
      });
      
      setLoading(false);
      
      if (onPaymentCreated) {
        onPaymentCreated(response.data.data);
      }
      
    } catch (err) {
      console.error('Erreur lors de la cru00e9ation du paiement:', err);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la cru00e9ation du paiement');
      setLoading(false);
    }
  };

  // Calculer le montant automatiquement en fonction des heures et du taux horaire
  useEffect(() => {
    const hours = parseFloat(watchHoursWorked) || 0;
    const rate = parseFloat(watchHourlyRate) || 0;
    setValue('amount', (hours * rate).toFixed(2));
  }, [watchHoursWorked, watchHourlyRate, setValue]);

  if (!missionData) {
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
        <h5 className="mb-0">Cru00e9er un nouveau paiement</h5>
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
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="periodStart" className="form-label">Du00e9but de la pu00e9riode</label>
              <input 
                type="date" 
                className={`form-control ${errors.periodStart ? 'is-invalid' : ''}`}
                id="periodStart"
                {...register('periodStart', { required: 'La date de du00e9but est requise' })}
              />
              {errors.periodStart && <div className="invalid-feedback">{errors.periodStart.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="periodEnd" className="form-label">Fin de la pu00e9riode</label>
              <input 
                type="date" 
                className={`form-control ${errors.periodEnd ? 'is-invalid' : ''}`}
                id="periodEnd"
                {...register('periodEnd', { required: 'La date de fin est requise' })}
              />
              {errors.periodEnd && <div className="invalid-feedback">{errors.periodEnd.message}</div>}
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="hoursWorked" className="form-label">Heures travaillu00e9es</label>
              <input 
                type="number" 
                step="0.5"
                min="0.5"
                className={`form-control ${errors.hoursWorked ? 'is-invalid' : ''}`}
                id="hoursWorked"
                {...register('hoursWorked', { 
                  required: 'Le nombre d\'heures est requis',
                  min: { value: 0.5, message: 'Minimum 0.5 heure' },
                  max: { value: validatedHours, message: `Maximum ${validatedHours} heures validu00e9es disponibles` }
                })}
              />
              {errors.hoursWorked && <div className="invalid-feedback">{errors.hoursWorked.message}</div>}
              <small className="form-text text-muted">{validatedHours} heures validu00e9es disponibles</small>
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="hourlyRate" className="form-label">Taux horaire (MAD)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className={`form-control ${errors.hourlyRate ? 'is-invalid' : ''}`}
                id="hourlyRate"
                {...register('hourlyRate', { 
                  required: 'Le taux horaire est requis',
                  min: { value: 0, message: 'Le taux horaire doit u00eatre positif' }
                })}
              />
              {errors.hourlyRate && <div className="invalid-feedback">{errors.hourlyRate.message}</div>}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Montant total (MAD)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              id="amount"
              {...register('amount', { 
                required: 'Le montant est requis',
                min: { value: 0, message: 'Le montant doit u00eatre positif' }
              })}
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="paymentMethod" className="form-label">Mu00e9thode de paiement</label>
              <select 
                className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
                id="paymentMethod"
                {...register('paymentMethod', { required: 'La mu00e9thode de paiement est requise' })}
              >
                <option value="">Su00e9lectionner une mu00e9thode</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="cash">Espu00e8ces</option>
                <option value="mobile_payment">Paiement mobile</option>
                <option value="check">Chu00e8que</option>
              </select>
              {errors.paymentMethod && <div className="invalid-feedback">{errors.paymentMethod.message}</div>}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="dueDate" className="form-label">Date d'u00e9chu00e9ance</label>
              <input 
                type="date" 
                className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                id="dueDate"
                {...register('dueDate')}
              />
              {errors.dueDate && <div className="invalid-feedback">{errors.dueDate.message}</div>}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="bankAccount" className="form-label">Coordonnu00e9es bancaires (si applicable)</label>
            <input 
              type="text" 
              className="form-control"
              id="bankAccount"
              placeholder="RIB ou IBAN"
              {...register('bankAccount')}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="checkNumber" className="form-label">Numu00e9ro de chu00e8que (si applicable)</label>
            <input 
              type="text" 
              className="form-control"
              id="checkNumber"
              {...register('checkNumber')}
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Notes</label>
            <textarea 
              className="form-control"
              id="notes"
              rows="3"
              placeholder="Informations compu00e9mentaires sur le paiement..."
              {...register('notes')}
            ></textarea>
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
                <FaSave className="me-2" /> Cru00e9er le paiement
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMissionPaymentForm;
