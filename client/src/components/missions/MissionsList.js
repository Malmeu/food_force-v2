import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import './Missions.css';

const MissionsList = ({ userType }) => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const endpoint = userType === 'establishment' ? '/missions/establishment' : '/missions/candidate';
        const response = await api.get(endpoint);
        setMissions(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des missions:', err);
        setError('Impossible de charger les missions. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchMissions();
  }, [userType]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en attente':
        return <FaHourglassHalf className="text-warning" title="En attente" />;
      case 'en cours':
        return <FaSpinner className="text-primary" title="En cours" />;
      case 'terminée':
        return <FaCheckCircle className="text-success" title="Terminée" />;
      case 'annulée':
        return <FaTimesCircle className="text-danger" title="Annulée" />;
      default:
        return <FaHourglassHalf className="text-secondary" title="Statut inconnu" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  if (loading) {
    return (
      <div className="missions-container p-4">
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
      <div className="missions-container p-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <div className="missions-container p-4">
        <div className="alert alert-info" role="alert">
          Aucune mission trouvée.
        </div>
      </div>
    );
  }

  return (
    <div className="missions-container p-4">
      <h2 className="mb-4">{userType === 'establishment' ? 'Missions créées' : 'Mes missions'}</h2>
      
      <div className="row">
        {missions.map((mission) => (
          <div className="col-md-6 col-lg-4 mb-4" key={mission._id}>
            <div className={`mission-card card h-100 border-${mission.status === 'terminée' ? 'success' : mission.status === 'en cours' ? 'primary' : 'warning'}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{mission.title}</h5>
                {getStatusIcon(mission.status)}
              </div>
              <div className="card-body">
                <p className="card-text">{mission.description.substring(0, 100)}...</p>
                <div className="mission-details">
                  <p><strong>Période:</strong> {formatDate(mission.startDate)} - {formatDate(mission.endDate)}</p>
                  <p><strong>Taux horaire:</strong> {mission.hourlyRate} MAD/h</p>
                  <p><strong>Heures estimées:</strong> {mission.estimatedHours}h</p>
                  {mission.actualHours > 0 && (
                    <p><strong>Heures réalisées:</strong> {mission.actualHours}h</p>
                  )}
                  <p><strong>Priorité:</strong> <span className={`badge bg-${mission.priority === 'haute' ? 'danger' : mission.priority === 'moyenne' ? 'warning' : 'info'}`}>{mission.priority}</span></p>
                </div>
              </div>
              <div className="card-footer">
                <Link to={`/missions/${mission._id}`} className="btn btn-primary w-100">Voir les détails</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsList;
