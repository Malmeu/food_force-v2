// Formater une date
export const formatDate = (dateString) => {
  if (!dateString) return 'Non spécifié';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Formater une date avec l'heure
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Non spécifié';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Formater un salaire
export const formatSalary = (salary) => {
  if (!salary) return 'Non spécifié';
  return `${salary.amount} ${salary.currency || 'MAD'} / ${salary.period}`;
};

// Formater un numéro de téléphone
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'Non spécifié';
  
  // Format marocain: 06 XX XX XX XX ou 07 XX XX XX XX
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  }
  
  return phoneNumber;
};

// Tronquer un texte
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Obtenir la couleur du statut d'une candidature
export const getStatusColor = (status) => {
  switch (status) {
    case 'En attente':
      return 'warning';
    case 'Examinée':
      return 'info';
    case 'Entretien':
      return 'primary';
    case 'Acceptée':
      return 'success';
    case 'Refusée':
      return 'error';
    default:
      return 'default';
  }
};

// Obtenir la couleur du type de contrat
export const getContractTypeColor = (contractType) => {
  switch (contractType) {
    case 'CDI':
      return 'success';
    case 'CDD':
      return 'primary';
    case 'Intérim':
      return 'warning';
    case 'Extra':
      return 'secondary';
    default:
      return 'default';
  }
};

// Formater une adresse
export const formatAddress = (address) => {
  if (!address) return 'Non spécifié';
  
  let formattedAddress = '';
  if (address.street) formattedAddress += address.street;
  if (address.city) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += address.city;
  }
  if (address.postalCode) {
    if (formattedAddress) formattedAddress += ' ';
    formattedAddress += address.postalCode;
  }
  if (address.country) {
    if (formattedAddress) formattedAddress += ', ';
    formattedAddress += address.country;
  }
  
  return formattedAddress || 'Non spécifié';
};
