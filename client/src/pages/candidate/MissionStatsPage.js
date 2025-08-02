import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaChartBar, FaMoneyBillWave, FaClock, FaBuilding, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

const MissionStatsPage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalMissions: 0,
    activeMissions: 0,
    completedMissions: 0,
    totalHours: 0,
    validatedHours: 0,
    pendingHours: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    missionsByEstablishment: [],
    recentMissions: [],
    recentWorkHours: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ru00e9cupu00e9rer les missions
        const missionsResponse = await axios.get('/api/missions/candidate');
        const missions = missionsResponse.data.data;
        
        // Ru00e9cupu00e9rer les paiements
        const paymentsResponse = await axios.get('/api/payments/candidate');
        const payments = paymentsResponse.data.data;
        
        // Ru00e9cupu00e9rer les heures travaillu00e9es
        const hoursResponse = await axios.get('/api/workhours/candidate');
        const workHours = hoursResponse.data.data;
        
        // Calculer les statistiques
        const activeMissions = missions.filter(mission => mission.status === 'en cours');
        const completedMissions = missions.filter(mission => mission.status === 'terminu00e9e');
        
        // Regrouper les missions par u00e9tablissement
        const missionsByEstablishment = [];
        const establishmentsMap = {};
        
        missions.forEach(mission => {
          const establishmentId = mission.establishment._id;
          if (!establishmentsMap[establishmentId]) {
            establishmentsMap[establishmentId] = {
              establishment: mission.establishment,
              missionsCount: 0,
              hoursWorked: 0,
              totalEarned: 0
            };
            missionsByEstablishment.push(establishmentsMap[establishmentId]);
          }
          establishmentsMap[establishmentId].missionsCount++;
        });
        
        // Ajouter les heures travaillu00e9es par u00e9tablissement
        workHours.forEach(hour => {
          if (hour.status === 'validu00e9' && establishmentsMap[hour.establishment]) {
            establishmentsMap[hour.establishment].hoursWorked += hour.hours;
          }
        });
        
        // Ajouter les paiements par u00e9tablissement
        payments.forEach(payment => {
          if (payment.status === 'Payu00e9' && establishmentsMap[payment.employer]) {
            establishmentsMap[payment.employer].totalEarned += payment.amount;
          }
        });
        
        // Trier les u00e9tablissements par nombre de missions
        missionsByEstablishment.sort((a, b) => b.missionsCount - a.missionsCount);
        
        // Calculer le total des heures
        const totalHours = workHours.reduce((sum, hour) => sum + hour.hours, 0);
        
        // Calculer les heures validu00e9es
        const validatedHours = workHours
          .filter(hour => hour.status === 'validu00e9')
          .reduce((sum, hour) => sum + hour.hours, 0);
        
        // Calculer les heures en attente
        const pendingHours = workHours
          .filter(hour => hour.status === 'en attente')
          .reduce((sum, hour) => sum + hour.hours, 0);
        
        // Calculer le total des revenus
        const totalEarnings = payments
          .filter(payment => payment.status === 'Payu00e9')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculer les paiements en attente
        const pendingPayments = payments
          .filter(payment => payment.status === 'En attente' || payment.status === 'Traitu00e9')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Missions ru00e9centes
        const recentMissions = [...missions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Heures travaillu00e9es ru00e9centes
        const recentWorkHours = [...workHours]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        
        setStats({
          totalMissions: missions.length,
          activeMissions: activeMissions.length,
          completedMissions: completedMissions.length,
          totalHours,
          validatedHours,
          pendingHours,
          totalEarnings,
          pendingPayments,
          missionsByEstablishment,
          recentMissions,
          recentWorkHours
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError('Impossible de charger les statistiques. Veuillez ru00e9essayer plus tard.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Mes statistiques</h1>
      
      {/* Cartes de statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary p-3 me-3">
                <FaBuilding className="text-white" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Missions totales</h6>
                <h3 className="mb-0">{stats.totalMissions}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success p-3 me-3">
                <FaClock className="text-white" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Heures validu00e9es</h6>
                <h3 className="mb-0">{stats.validatedHours}h</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-info p-3 me-3">
                <FaMoneyBillWave className="text-white" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Revenus totaux</h6>
                <h3 className="mb-0">{formatCurrency(stats.totalEarnings)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-warning p-3 me-3">
                <FaMoneyBillWave className="text-white" size={24} />
              </div>
              <div>
                <h6 className="text-muted mb-1">Paiements en attente</h6>
                <h3 className="mb-0">{formatCurrency(stats.pendingPayments)}</h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        {/* Missions par u00e9tablissement */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0"><FaBuilding className="me-2" /> Missions par u00e9tablissement</h5>
            </Card.Header>
            <Card.Body>
              {stats.missionsByEstablishment.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>u00c9tablissement</th>
                      <th>Missions</th>
                      <th>Heures</th>
                      <th>Revenus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.missionsByEstablishment.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.establishment.establishmentProfile?.name}
                        </td>
                        <td>{item.missionsCount}</td>
                        <td>{item.hoursWorked}h</td>
                        <td>{formatCurrency(item.totalEarned)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucune mission pour le moment.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Missions ru00e9centes */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0"><FaCalendarAlt className="me-2" /> Missions ru00e9centes</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentMissions.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>u00c9tablissement</th>
                      <th>Statut</th>
                      <th>Cru00e9u00e9e le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMissions.map((mission, index) => (
                      <tr key={index}>
                        <td>{mission.title}</td>
                        <td>
                          {mission.establishment.establishmentProfile?.name}
                        </td>
                        <td>
                          <Badge bg={
                            mission.status === 'terminu00e9e' ? 'success' :
                            mission.status === 'en cours' ? 'primary' :
                            mission.status === 'en attente' ? 'warning' : 'secondary'
                          }>
                            {mission.status}
                          </Badge>
                        </td>
                        <td>{formatDate(mission.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucune mission ru00e9cente.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Heures travaillu00e9es ru00e9centes */}
      <Row>
        <Col className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0"><FaClock className="me-2" /> Heures travaillu00e9es ru00e9centes</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentWorkHours.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Mission</th>
                      <th>Heures</th>
                      <th>Statut</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentWorkHours.map((hour, index) => (
                      <tr key={index}>
                        <td>{formatDate(hour.date)}</td>
                        <td>{hour.mission?.title || 'Mission inconnue'}</td>
                        <td>{hour.hours}h</td>
                        <td>
                          <Badge bg={
                            hour.status === 'validu00e9' ? 'success' :
                            hour.status === 'refusu00e9' ? 'danger' : 'warning'
                          }>
                            {hour.status}
                          </Badge>
                        </td>
                        <td>{hour.description.substring(0, 50)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucune heure travaillu00e9e ru00e9cente.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MissionStatsPage;
