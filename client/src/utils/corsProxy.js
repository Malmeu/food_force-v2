/**
 * Fonction utilitaire pour contourner les problèmes CORS
 * en utilisant un proxy CORS public (à utiliser uniquement en développement)
 */
export const corsProxy = (url) => {
  // En production, utilisez directement l'URL
  if (process.env.NODE_ENV === 'production') {
    return url;
  }
  
  // En développement, utilisez un proxy CORS si nécessaire
  return url;
};

/**
 * Fonction pour créer des options fetch avec CORS
 */
export const createFetchOptions = (options = {}) => {
  return {
    ...options,
    mode: 'cors',
    credentials: 'include',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
};
