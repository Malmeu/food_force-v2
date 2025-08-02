import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSpinner, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import WorkHoursList from '../workHours/WorkHoursList';
import RecordWorkHoursForm from '../workHours/RecordWorkHoursForm';
import MissionPayments from '../payments/MissionPayments';
import './Missions.css';

const MissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchMission = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/missions/${id}`);
        setMission(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement de la mission:', err);
        setError('Impossible de charger les du00e9tails de la mission. Veuillez ru00e9essayer plus tard.');
        setLoading(false);
      }
    };

    fetchMission();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/missions/${id}/status`, { status: newStatus });
      // Mettre u00e0 jour la mission localement
      setMission({ ...mission, status: newStatus });
    } catch (err) {
      console.error('Erreur lors de la mise u00e0 jour du statut:', err);
      alert('Impossible de mettre u00e0 jour le statut de la mission.');
    }
  };

  const getStatusBadge = (status) => {
    let badgeClass = '';
    let icon = null;

    switch (status) {
      case 'en attente':
        badgeClass = 'bg-warning';
        icon = <FaHourglassHalf className="me-1" />;
        break;
      case 'en cours':
        badgeClass = 'bg-primary';
        icon = <FaSpinner className="me-1" />;
        break;
      case 'terminu00e9e':
        badgeClass = 'bg-success';
        icon = <FaCheckCircle className="me-1" />;
        break;
      case 'annulu00e9e':
        badgeClass = 'bg-danger';
        icon = <FaTimesCircle className="me-1" />;
        break;
      default:
        badgeClass = 'bg-secondary';
        icon = <FaHourglassHalf className="me-1" />;
    }

    return (
      <span className={`badge ${badgeClass} mission-status-badge`}>
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Non du00e9finie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const isCandidate = currentUser?.userType === 'candidat';
  const isEstablishment = currentUser?.userType === 'establishment';

  if (loading) {
    return (
      <div className="container mt-5">
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
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Mission non trouvu00e9e.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mission-detail-header">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{mission.title}</h2>
          {getStatusBadge(mission.status)}
        </div>
        <p className="lead">{mission.description}</p>
        <div className="row mt-4">
          <div className="col-md-6">
            <p><strong>Pu00e9riode:</strong> {formatDate(mission.startDate)} - {formatDate(mission.endDate)}</p>
            <p><strong>Taux horaire:</strong> {mission.hourlyRate} MAD/h</p>
            <p><strong>Heures estimu00e9es:</strong> {mission.estimatedHours}h</p>
            {mission.actualHours > 0 && (
              <p><strong>Heures ru00e9alisu00e9es:</strong> {mission.actualHours}h</p>
            )}
          </div>
          <div className="col-md-6">
            <p><strong>Prioritu00e9:</strong> <span className={`badge bg-${mission.priority === 'haute' ? 'danger' : mission.priority === 'moyenne' ? 'warning' : 'info'}`}>{mission.priority}</span></p>
            <p><strong>Montant estimu00e9:</strong> {mission.hourlyRate * mission.estimatedHours} MAD</p>
            {mission.actualHours > 0 && (
              <p><strong>Montant actuel:</strong> {mission.hourlyRate * mission.actualHours} MAD</p>
            )}
            <p><strong>Cru00e9u00e9e le:</strong> {formatDate(mission.createdAt)}</p>
          </div>
        </div>

        {isCandidate && mission.status === 'en attente' && (
          <div className="mission-action-buttons">
            <button 
              className="btn btn-primary" 
              onClick={() => handleStatusChange('en cours')}
            >
              <FaSpinner className="me-2" /> Du00e9marrer la mission
            </button>
          </div>
        )}

        {isCandidate && mission.status === 'en cours' && (
          <div className="mission-action-buttons">
            <button 
              className="btn btn-success" 
              onClick={() => handleStatusChange('terminu00e9e')}
            >
              <FaCheckCircle className="me-2" /> Marquer comme terminu00e9e
            </button>
          </div>
        )}
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Du00e9tails
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'hours' ? 'active' : ''}`}
            onClick={() => setActiveTab('hours')}
          >
            <FaClock className="me-1" /> Heures travaillu00e9es
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <FaMoneyBillWave className="me-1" /> Paiements
          </button>
        </li>
      </ul>

      {activeTab === 'details' && (
        <div className="mission-section">
          <h3 className="mission-section-title">Du00e9tails de la mission</h3>
          <div className="row">
            <div className="col-md-6">
              <h4>Informations sur {isCandidate ? 'l\'u00e9tablissement' : 'le candidat'}</h4>
              {isCandidate ? (
                <div>
                  <p><strong>Nom de l'u00e9tablissement:</strong> {mission.establishment?.establishmentProfile?.name}</p>
                  <p><strong>Email:</strong> {mission.establishment?.email}</p>
                  <p><strong>Tu00e9lu00e9phone:</strong> {mission.establishment?.phone}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Nom:</strong> {mission.candidate?.candidateProfile?.firstName} {mission.candidate?.candidateProfile?.lastName}</p>
                  <p><strong>Email:</strong> {mission.candidate?.email}</p>
                  <p><strong>Tu00e9lu00e9phone:</strong> {mission.candidate?.phone}</p>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <h4>Notes</h4>
              <p>{mission.notes || 'Aucune note disponible.'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hours' && (
        <div className="mission-section">
          <h3 className="mission-section-title">Heures travaillu00e9es</h3>
          
          {isCandidate && mission.status === 'en cours' && (
            <RecordWorkHoursForm missionId={mission._id} onRecordSuccess={() => {
              // Recharger la mission pour mettre u00e0 jour les heures ru00e9elles
              axios.get(`/api/missions/${id}`).then(response => {
                setMission(response.data.data);
              });
            }} />
          )}
          
          <WorkHoursList missionId={mission._id} userType={currentUser.userType} />
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="mission-section">
          <h3 className="mission-section-title">Paiements</h3>
          <MissionPayments missionId={mission._id} userType={currentUser.userType} />
        </div>
      )}
    </div>
  );
};

export default MissionDetails;
