// Système de notifications
const User = require('../models/User');
const { sendEmail } = require('./email');

/**
 * Envoyer une notification par email
 * @param {string} userId - ID de l'utilisateur
 * @param {string} subject - Sujet de l'email
 * @param {string} message - Contenu de l'email
 * @returns {Promise<boolean>} - Succès ou échec
 */
const sendEmailNotification = async (userId, subject, message) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.email) {
      return false;
    }
    
    await sendEmail({
      email: user.email,
      subject,
      message
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification par email:', error);
    return false;
  }
};

/**
 * Envoyer une notification d'offre d'emploi
 * @param {Object} job - Offre d'emploi
 * @param {Array} candidateIds - IDs des candidats à notifier
 * @returns {Promise<number>} - Nombre de notifications envoyées
 */
const sendJobNotification = async (job, candidateIds) => {
  let sentCount = 0;
  
  const subject = `Nouvelle offre d'emploi: ${job.title}`;
  const message = `
    Bonjour,
    
    Une nouvelle offre d'emploi correspondant à votre profil a été publiée :
    
    Titre: ${job.title}
    Entreprise: ${job.employer.establishmentProfile?.name || 'Entreprise'}
    Type de contrat: ${job.contractType}
    Lieu: ${job.location?.city || 'Non spécifié'}
    
    Pour postuler ou voir plus de détails, connectez-vous à votre compte FoodForce Maroc.
    
    Cordialement,
    L'équipe FoodForce Maroc
  `;
  
  for (const candidateId of candidateIds) {
    const success = await sendEmailNotification(candidateId, subject, message);
    if (success) sentCount++;
  }
  
  return sentCount;
};

/**
 * Envoyer une notification de candidature
 * @param {Object} application - Candidature
 * @returns {Promise<boolean>} - Succès ou échec
 */
const sendApplicationNotification = async (application) => {
  try {
    const job = await require('../models/Job').findById(application.job);
    const employer = await User.findById(job.employer);
    
    const subject = `Nouvelle candidature pour: ${job.title}`;
    const message = `
      Bonjour,
      
      Vous avez reçu une nouvelle candidature pour votre offre d'emploi:
      
      Titre: ${job.title}
      Candidat: ${application.candidate.candidateProfile?.firstName} ${application.candidate.candidateProfile?.lastName}
      Date de candidature: ${new Date(application.appliedAt).toLocaleDateString('fr-FR')}
      
      Pour consulter cette candidature, connectez-vous à votre compte FoodForce Maroc.
      
      Cordialement,
      L'équipe FoodForce Maroc
    `;
    
    return await sendEmailNotification(employer._id, subject, message);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de candidature:', error);
    return false;
  }
};

/**
 * Envoyer une notification de changement de statut de candidature
 * @param {Object} application - Candidature
 * @param {string} previousStatus - Statut précédent
 * @returns {Promise<boolean>} - Succès ou échec
 */
const sendStatusChangeNotification = async (application, previousStatus) => {
  try {
    const job = await require('../models/Job').findById(application.job);
    
    const subject = `Mise à jour de votre candidature: ${job.title}`;
    const message = `
      Bonjour,
      
      Le statut de votre candidature a été mis à jour:
      
      Titre: ${job.title}
      Entreprise: ${job.employer.establishmentProfile?.name || 'Entreprise'}
      Ancien statut: ${previousStatus}
      Nouveau statut: ${application.status}
      
      Pour plus de détails, connectez-vous à votre compte FoodForce Maroc.
      
      Cordialement,
      L'équipe FoodForce Maroc
    `;
    
    return await sendEmailNotification(application.candidate, subject, message);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de changement de statut:', error);
    return false;
  }
};

module.exports = {
  sendEmailNotification,
  sendJobNotification,
  sendApplicationNotification,
  sendStatusChangeNotification
};
