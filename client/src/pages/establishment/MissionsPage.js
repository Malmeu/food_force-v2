import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MissionsList from '../../components/missions/MissionsList';
import { useAuth } from '../../contexts/AuthContext';

const MissionsPage = () => {
  const { currentUser } = useAuth();

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <h1 className="mb-4">Gestion des missions</h1>
          <p className="lead mb-4">
            Suivez et gu00e9rez les missions assignu00e9es aux candidats que vous avez recrutés.
          </p>
        </Col>
      </Row>

      <Row>
        <Col>
          <MissionsList userType="establishment" />
        </Col>
      </Row>
    </Container>
  );
};

export default MissionsPage;
