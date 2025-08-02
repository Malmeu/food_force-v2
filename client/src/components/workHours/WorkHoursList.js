import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const WorkHoursList = ({ missionId, userType }) => {
  const [workHours, setWorkHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    const fetchWorkHours = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/workhours/mission/${missionId}`);
        setWorkHours(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des heures travaillu00e9es:', err);
        setError('Impossible de charger les heures travaillu00e9es. Veuillez ru00e9essayer plus tard.');
        setLoading(false);
      }
    };

    fetchWorkHours();
  }, [missionId]);

  const handleValidate = async (id) => {
    try {
      await axios.put(`/api/workhours/${id}/validate`);
      // Mettre u00e0 jour la liste localement
      setWorkHours(workHours.map(item => 
        item._id === id ? { ...item, status: 'validu00e9', validatedAt: new Date() } : item
      ));
    } catch (err) {
      console.error('Erreur lors de la validation des heures:', err);
      alert('Impossible de valider les heures travaillu00e9es.');
    }
  };

  const handleReject = async (id) => {
    try {
      if (!rejectionReason) {
        alert('Veuillez indiquer une raison de refus.');
        return;
      }
      
      await axios.put(`/api/workhours/${id}/reject`, { reason: rejectionReason });
      
      // Mettre u00e0 jour la liste localement
      setWorkHours(workHours.map(item => 
        item._id === id ? { 
          ...item, 
          status: 'refusu00e9', 
          validatedAt: new Date(),
          rejectionReason: rejectionReason 
        } : item
      ));
      
      // Ru00e9initialiser
      setRejectionReason('');
      setRejectingId(null);
    } catch (err) {
      console.error('Erreur lors du refus des heures:', err);
      alert('Impossible de refuser les heures travaillu00e9es.');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'validu00e9':
        return <span className="badge bg-success"><FaCheckCircle className="me-1" /> Validu00e9</span>;
      case 'refusu00e9':
        return <span className="badge bg-danger"><FaTimesCircle className="me-1" /> Refusu00e9</span>;
      default:
        return <span className="badge bg-warning"><FaHourglassHalf className="me-1" /> En attente</span>;
    }
  };

  if (loading) {
    return (
      <div className="work-hours-list">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="work-hours-list">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (workHours.length === 0) {
    return (
      <div className="work-hours-list">
        <div className="alert alert-info" role="alert">
          Aucune heure travaillu00e9e enregistru00e9e pour cette mission.
        </div>
      </div>
    );
  }

  return (
    <div className="work-hours-list">
      <h4 className="mb-3">Heures travaillu00e9es enregistru00e9es</h4>
      
      {workHours.map((item) => (
        <div 
          key={item._id} 
          className={`work-hours-item p-3 mb-3 ${item.status === 'validu00e9' ? 'validated' : item.status === 'refusu00e9' ? 'rejected' : 'pending'}`}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="work-hours-date">{formatDate(item.date)}</div>
              <div className="work-hours-hours">{item.hours} heures</div>
              <div className="work-hours-description">{item.description}</div>
              
              {item.status === 'refusu00e9' && item.rejectionReason && (
                <div className="alert alert-danger mt-2 p-2">
                  <strong>Raison du refus:</strong> {item.rejectionReason}
                </div>
              )}
            </div>
            
            <div className="d-flex flex-column align-items-end">
              <div className="work-hours-status mb-2">
                {getStatusBadge(item.status)}
              </div>
              
              {userType === 'establishment' && item.status === 'en attente' && (
                <div className="btn-group">
                  <button 
                    className="btn btn-sm btn-success" 
                    onClick={() => handleValidate(item._id)}
                  >
                    <FaCheckCircle className="me-1" /> Valider
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => setRejectingId(item._id)}
                  >
                    <FaTimesCircle className="me-1" /> Refuser
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {rejectingId === item._id && (
            <div className="mt-3">
              <div className="form-group">
                <label htmlFor="rejectionReason">Raison du refus</label>
                <textarea 
                  className="form-control" 
                  id="rejectionReason" 
                  rows="2"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Indiquez la raison du refus..."
                ></textarea>
              </div>
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-danger me-2" 
                  onClick={() => handleReject(item._id)}
                >
                  Confirmer le refus
                </button>
                <button 
                  className="btn btn-sm btn-secondary" 
                  onClick={() => {
                    setRejectingId(null);
                    setRejectionReason('');
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="mt-4">
        <h5>Ru00e9sumu00e9</h5>
        <p>
          <strong>Total des heures:</strong> {workHours.reduce((sum, item) => sum + item.hours, 0)} heures
        </p>
        <p>
          <strong>Heures validu00e9es:</strong> {workHours.filter(item => item.status === 'validu00e9').reduce((sum, item) => sum + item.hours, 0)} heures
        </p>
      </div>
    </div>
  );
};

export default WorkHoursList;
