import React from 'react';
import { Container } from 'react-bootstrap';
import MissionDetails from '../../components/missions/MissionDetails';
import { useAuth } from '../../contexts/AuthContext';

const MissionDetailsPage = () => {
  const { currentUser } = useAuth();

  return (
    <Container fluid className="p-0">
      <MissionDetails />
    </Container>
  );
};

export default MissionDetailsPage;
