import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Composants de mise en page
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages publiques
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import EstablishmentPublicProfilePage from './pages/EstablishmentPublicProfilePage';

// Pages de recrutement
import RecruitPage from './pages/recruit/RecruitPage';
import RecruitHomePage from './pages/recruit/RecruitHomePage';
import WhyUsPage from './pages/recruit/WhyUsPage';
import JobOffersPage from './pages/recruit/JobOffersPage';
import ProcessPage from './pages/recruit/ProcessPage';
import TrainingPage from './pages/recruit/TrainingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyAccountPage from './pages/VerifyAccountPage';
import LoginTestPage from './pages/establishment/LoginTestPage';
import TestJobCreation from './pages/establishment/TestJobCreation';

// Pages privées pour les candidats
import CandidateDashboardPage from './pages/candidate/DashboardPage';
import CandidateProfilePage from './pages/candidate/ProfilePage';
import CandidateApplicationsPage from './pages/candidate/ApplicationsPage';
import CandidateMissionsPage from './pages/candidate/MissionsPage';
import CandidateMissionDetailsPage from './pages/candidate/MissionDetailsPage';
import CandidateMissionStatsPage from './pages/candidate/MissionStatsPage';
import CandidateJobDetailsPage from './pages/candidate/JobDetailsPage';
import CandidateApplicationDetailsPage from './pages/candidate/ApplicationDetailsPage';

// Pages privées pour les établissements
import EstablishmentDashboardPage from './pages/establishment/DashboardPage';
import EstablishmentProfilePage from './pages/establishment/ProfilePage';
import EstablishmentJobsPage from './pages/establishment/JobsPage';
import EstablishmentCreateJobPage from './pages/establishment/CreateJobPage';
import EstablishmentApplicationsPage from './pages/establishment/ApplicationsPage';
import EstablishmentCandidatesPage from './pages/establishment/CandidatesPage';
import EstablishmentMissionsPage from './pages/establishment/MissionsPage';
import EstablishmentMissionDetailsPage from './pages/establishment/MissionDetailsPage';
import EstablishmentMissionStatsPage from './pages/establishment/MissionStatsPage';
import EstablishmentJobDetailsPage from './pages/establishment/JobDetailsPage';
import EstablishmentApplicationDetailsPage from './pages/establishment/ApplicationDetailsPage';

// Pages communes pour les utilisateurs authentifiés
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import RatingsPage from './pages/RatingsPage';
import PaymentsPage from './pages/PaymentsPage';

// Route protégée
import PrivateRoute from './components/routing/PrivateRoute';

// Thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#29335C',
      light: '#FF7043',
      dark: '#E64A19',
    },
    secondary: {
      main: '#f57c00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  // Ajout d'un console.log pour déboguer le rendu de l'application
  console.log('App rendu');
  
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <main className="container" style={{ paddingTop: '80px', paddingLeft: { xs: '0px', md: '280px' }, transition: 'padding-left 0.3s' }}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/establishments/:id" element={<EstablishmentPublicProfilePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify/:token" element={<VerifyAccountPage />} />
          
          {/* Routes de test */}
          <Route path="/login-test" element={<LoginTestPage />} />
          <Route path="/test-job-creation" element={<TestJobCreation />} />
          
          {/* Routes de recrutement */}
          <Route path="/recruit" element={<RecruitPage />}>
            <Route index element={<RecruitHomePage />} />
            <Route path="pourquoi-nous" element={<WhyUsPage />} />
            <Route path="offres" element={<JobOffersPage />} />
            <Route path="processus" element={<ProcessPage />} />
            <Route path="formation" element={<TrainingPage />} />
          </Route>
          
          {/* Routes communes pour les utilisateurs authentifiés */}
          <Route element={<PrivateRoute />}>
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Route>
          
          {/* Routes privées pour les candidats */}
          <Route element={<PrivateRoute userType="candidat" />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
            <Route path="/candidate/profile" element={<CandidateProfilePage />} />
            <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
            <Route path="/candidate/applications/:id" element={<CandidateApplicationDetailsPage />} />
            <Route path="/candidate/missions" element={<CandidateMissionsPage />} />
            <Route path="/candidate/missions/:id" element={<CandidateMissionDetailsPage />} />
            <Route path="/candidate/mission-stats" element={<CandidateMissionStatsPage />} />
            <Route path="/candidate/jobs/:id" element={<CandidateJobDetailsPage />} />
          </Route>
          
          {/* Routes privées pour les établissements */}
          <Route element={<PrivateRoute userType="etablissement" />}>
            <Route path="/establishment/dashboard" element={<EstablishmentDashboardPage />} />
            <Route path="/establishment/profile" element={<EstablishmentProfilePage />} />
            <Route path="/establishment/jobs" element={<EstablishmentJobsPage />} />
            <Route path="/establishment/jobs/:id" element={<EstablishmentJobDetailsPage />} />
            <Route path="/establishment/jobs/create" element={<EstablishmentCreateJobPage />} />
            <Route path="/establishment/applications" element={<EstablishmentApplicationsPage />} />
            <Route path="/establishment/applications/:id" element={<EstablishmentApplicationDetailsPage />} />
            <Route path="/establishment/candidates" element={<EstablishmentCandidatesPage />} />
            <Route path="/establishment/missions" element={<EstablishmentMissionsPage />} />
            <Route path="/establishment/missions/:id" element={<EstablishmentMissionDetailsPage />} />
            <Route path="/establishment/mission-stats" element={<EstablishmentMissionStatsPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </ThemeProvider>
  );
}

export default App;
