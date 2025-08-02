// Configuration des routes API

// Préfixes des routes
const API_PREFIX = '/api';
const AUTH_PREFIX = '/auth';
const USERS_PREFIX = '/users';
const JOBS_PREFIX = '/jobs';
const APPLICATIONS_PREFIX = '/applications';

// Versions de l'API
const API_VERSION = 'v1';

// Routes complètes
const ROUTES = {
  AUTH: {
    REGISTER: `${API_PREFIX}${AUTH_PREFIX}/register`,
    LOGIN: `${API_PREFIX}${AUTH_PREFIX}/login`,
    ME: `${API_PREFIX}${AUTH_PREFIX}/me`,
    FORGOT_PASSWORD: `${API_PREFIX}${AUTH_PREFIX}/forgot-password`,
    RESET_PASSWORD: `${API_PREFIX}${AUTH_PREFIX}/reset-password/:token`,
    UPDATE_PASSWORD: `${API_PREFIX}${AUTH_PREFIX}/update-password`,
    VERIFY_ACCOUNT: `${API_PREFIX}${AUTH_PREFIX}/verify/:token`,
  },
  USERS: {
    PROFILE: `${API_PREFIX}${USERS_PREFIX}/profile`,
    UPLOAD: `${API_PREFIX}${USERS_PREFIX}/upload`,
    CANDIDATES: `${API_PREFIX}${USERS_PREFIX}/candidates`,
    CANDIDATE_PROFILE: `${API_PREFIX}${USERS_PREFIX}/candidates/:id`,
    ESTABLISHMENTS: `${API_PREFIX}${USERS_PREFIX}/establishments`,
    ESTABLISHMENT_PROFILE: `${API_PREFIX}${USERS_PREFIX}/establishments/:id`,
    SEARCH_CANDIDATES: `${API_PREFIX}${USERS_PREFIX}/candidates/search`,
    RATINGS: `${API_PREFIX}${USERS_PREFIX}/:id/ratings`,
  },
  JOBS: {
    BASE: `${API_PREFIX}${JOBS_PREFIX}`,
    DETAIL: `${API_PREFIX}${JOBS_PREFIX}/:id`,
    RADIUS: `${API_PREFIX}${JOBS_PREFIX}/radius/:city/:distance`,
  },
  APPLICATIONS: {
    BASE: `${API_PREFIX}${APPLICATIONS_PREFIX}`,
    DETAIL: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id`,
    EMPLOYER: `${API_PREFIX}${APPLICATIONS_PREFIX}/employer`,
    CANDIDATE: `${API_PREFIX}${APPLICATIONS_PREFIX}/candidate`,
    STATUS: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id/status`,
    HOURS: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id/hours`,
    VALIDATE_HOURS: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id/hours/:hourId/validate`,
    EMPLOYER_FEEDBACK: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id/feedback/employer`,
    CANDIDATE_FEEDBACK: `${API_PREFIX}${APPLICATIONS_PREFIX}/:id/feedback/candidate`,
  },
};

module.exports = {
  API_PREFIX,
  AUTH_PREFIX,
  USERS_PREFIX,
  JOBS_PREFIX,
  APPLICATIONS_PREFIX,
  API_VERSION,
  ROUTES,
};
