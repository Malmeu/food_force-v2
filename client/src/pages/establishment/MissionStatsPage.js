import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaChartBar, FaMoneyBillWave, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa';
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
    totalPayments: 0,
    pendingPayments: 0,
    missionsByCandidate: [],
    recentMissions: [],
    recentPayments: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ru00e9cupu00e9rer les missions
        const missionsResponse = await axios.get('/api/missions/establishment');
        const missions = missionsResponse.data.data;
        
        // Ru00e9cupu00e9rer les paiements
        const paymentsResponse = await axios.get('/api/payments/employer');
        const payments = paymentsResponse.data.data;
        
        // Ru00e9cupu00e9rer les heures travaillu00e9es
        const hoursResponse = await axios.get('/api/workhours/establishment');
        const workHours = hoursResponse.data.data;
        
        // Calculer les statistiques
        const activeMissions = missions.filter(mission => mission.status === 'en cours');
        const completedMissions = missions.filter(mission => mission.status === 'terminu00e9e');
        
        // Regrouper les missions par candidat
        const missionsByCandidate = [];
        const candidatesMap = {};
        
        missions.forEach(mission => {
          const candidateId = mission.candidate._id;
          if (!candidatesMap[candidateId]) {
            candidatesMap[candidateId] = {
              candidate: mission.candidate,
              missionsCount: 0,
              hoursWorked: 0,
              totalPaid: 0
            };
            missionsByCandidate.push(candidatesMap[candidateId]);
          }
          candidatesMap[candidateId].missionsCount++;
        });
        
        // Ajouter les heures travaillu00e9es par candidat
        workHours.forEach(hour => {
          if (hour.status === 'validu00e9' && candidatesMap[hour.candidate]) {
            candidatesMap[hour.candidate].hoursWorked += hour.hours;
          }
        });
        
        // Ajouter les paiements par candidat
        payments.forEach(payment => {
          if (payment.status === 'Payu00e9' && candidatesMap[payment.candidate]) {
            candidatesMap[payment.candidate].totalPaid += payment.amount;
          }
        });
        
        // Trier les candidats par nombre de missions
        missionsByCandidate.sort((a, b) => b.missionsCount - a.missionsCount);
        
        // Calculer le total des heures validu00e9es
        const totalHours = workHours
          .filter(hour => hour.status === 'validu00e9')
          .reduce((sum, hour) => sum + hour.hours, 0);
        
        // Calculer le total des paiements
        const totalPayments = payments
          .filter(payment => payment.status === 'Payu00e9')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculer les paiements en attente
        const pendingPayments = payments
          .filter(payment => payment.status === 'En attente')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        // Missions ru00e9centes
        const recentMissions = [...missions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        // Paiements ru00e9cents
        const recentPayments = [...payments]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        
        setStats({
          totalMissions: missions.length,
          activeMissions: activeMissions.length,
          completedMissions: completedMissions.length,
          totalHours,
          totalPayments,
          pendingPayments,
          missionsByCandidate,
          recentMissions,
          recentPayments
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
      <h1 className="mb-4">Tableau de bord des missions</h1>
      
      {/* Cartes de statistiques */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary p-3 me-3">
                <FaUsers className="text-white" size={24} />
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
                <h3 className="mb-0">{stats.totalHours}h</h3>
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
                <h6 className="text-muted mb-1">Paiements effectuu00e9s</h6>
                <h3 className="mb-0">{formatCurrency(stats.totalPayments)}</h3>
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
        {/* Missions par candidat */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0"><FaUsers className="me-2" /> Candidats actifs</h5>
            </Card.Header>
            <Card.Body>
              {stats.missionsByCandidate.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Candidat</th>
                      <th>Missions</th>
                      <th>Heures</th>
                      <th>Montant payu00e9</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.missionsByCandidate.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item.candidate.candidateProfile?.firstName} {item.candidate.candidateProfile?.lastName}
                        </td>
                        <td>{item.missionsCount}</td>
                        <td>{item.hoursWorked}h</td>
                        <td>{formatCurrency(item.totalPaid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucun candidat actif pour le moment.</Alert>
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
                      <th>Candidat</th>
                      <th>Statut</th>
                      <th>Cru00e9u00e9e le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMissions.map((mission, index) => (
                      <tr key={index}>
                        <td>{mission.title}</td>
                        <td>
                          {mission.candidate.candidateProfile?.firstName} {mission.candidate.candidateProfile?.lastName}
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
      
      {/* Paiements ru00e9cents */}
      <Row>
        <Col className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0"><FaMoneyBillWave className="me-2" /> Paiements ru00e9cents</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentPayments.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Candidat</th>
                      <th>Montant</th>
                      <th>Heures</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>
                          {payment.candidate.candidateProfile?.firstName} {payment.candidate.candidateProfile?.lastName}
                        </td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>{payment.hoursWorked}h</td>
                        <td>
                          <Badge bg={
                            payment.status === 'Payu00e9' ? 'success' :
                            payment.status === 'Traitu00e9' ? 'primary' : 'warning'
                          }>
                            {payment.status}
                          </Badge>
                        </td>
                        <td>{formatDate(payment.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">Aucun paiement ru00e9cent.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MissionStatsPage;
