const Payment = require('../models/Payment');
const Application = require('../models/Application');
const User = require('../models/User');
const Mission = require('../models/Mission');
const WorkHours = require('../models/WorkHours');
const { PAYMENT_STATUS } = require('../config/constants');
const { createNotification } = require('./notificationController');

/**
 * @desc    Cru00e9er un nouveau paiement liu00e9 u00e0 une candidature
 * @route   POST /api/payments
 * @access  Private/Establishment
 */
const createPayment = async (req, res) => {
  try {
    const { applicationId, amount, hoursWorked, paymentMethod, paymentDetails } = req.body;

    // Vu00e9rifier que l'application existe
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est bien l'employeur
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 cru00e9er un paiement pour cette candidature'
      });
    }

    // Cru00e9er le paiement
    const payment = new Payment({
      application: applicationId,
      employer: req.user.id,
      candidate: application.candidate._id,
      job: application.job._id,
      amount,
      hoursWorked,
      paymentMethod,
      paymentDetails,
      status: PAYMENT_STATUS.PENDING
    });

    await payment.save();

    // Cru00e9er une notification pour le candidat
    await createNotification(
      application.candidate._id,
      'payment',
      'Nouveau paiement en attente',
      `Un paiement de ${amount} MAD a u00e9tu00e9 cru00e9u00e9 pour votre travail chez ${req.user.establishmentProfile?.name || 'l\'u00e9tablissement'}.`,
      { application: applicationId }
    );

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la cru00e9ation du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la cru00e9ation du paiement'
    });
  }
};

/**
 * @desc    Cru00e9er un nouveau paiement liu00e9 u00e0 une mission
 * @route   POST /api/payments/mission
 * @access  Private/Establishment
 */
const createMissionPayment = async (req, res) => {
  try {
    const { 
      missionId, 
      amount, 
      hoursWorked, 
      periodStart, 
      periodEnd, 
      paymentMethod, 
      paymentDetails,
      dueDate 
    } = req.body;

    // Vu00e9rifier que la mission existe
    const mission = await Mission.findById(missionId)
      .populate('candidate');

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est bien l'u00e9tablissement propriu00e9taire de la mission
    if (mission.establishment.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 cru00e9er un paiement pour cette mission'
      });
    }

    // Vu00e9rifier que les heures travailu00e9es sont validu00e9es
    const validatedHours = await WorkHours.find({
      mission: missionId,
      status: 'validu00e9',
      date: { $gte: new Date(periodStart), $lte: new Date(periodEnd) }
    }).select('hours');

    const totalValidatedHours = validatedHours.reduce((sum, record) => sum + record.hours, 0);

    if (totalValidatedHours < hoursWorked) {
      return res.status(400).json({
        success: false,
        message: `Seulement ${totalValidatedHours} heures ont u00e9tu00e9 validu00e9es pour cette pu00e9riode. Impossible de cru00e9er un paiement pour ${hoursWorked} heures.`
      });
    }

    // Gu00e9nu00e9rer un numu00e9ro de facture unique
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Cru00e9er le paiement
    const payment = new Payment({
      mission: missionId,
      employer: req.user.id,
      candidate: mission.candidate._id,
      amount,
      hoursWorked,
      periodStart,
      periodEnd,
      paymentMethod,
      paymentDetails,
      invoiceNumber,
      dueDate,
      status: PAYMENT_STATUS.PENDING
    });

    await payment.save();

    // Cru00e9er une notification pour le candidat
    await createNotification(
      mission.candidate._id,
      'payment',
      'Nouveau paiement pour mission',
      `Un paiement de ${amount} MAD a u00e9tu00e9 cru00e9u00e9 pour votre mission "${mission.title}".`,
      { mission: missionId, payment: payment._id }
    );

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la cru00e9ation du paiement pour mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la cru00e9ation du paiement pour mission'
    });
  }
};

/**
 * @desc    Mettre u00e0 jour le statut d'un paiement
 * @route   PUT /api/payments/:id/status
 * @access  Private/Establishment
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { status, paymentDate } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvu00e9'
      });
    }

    // Vu00e9rifier que l'utilisateur est bien l'employeur
    if (payment.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 modifier ce paiement'
      });
    }

    // Mettre u00e0 jour le statut
    payment.status = status;
    if (status === PAYMENT_STATUS.PAID) {
      payment.paymentDate = paymentDate || Date.now();
    }

    await payment.save();

    // Cru00e9er une notification pour le candidat
    let notificationTitle, notificationMessage;
    if (status === PAYMENT_STATUS.PAID) {
      notificationTitle = 'Paiement effectuu00e9';
      notificationMessage = `Votre paiement de ${payment.amount} MAD a u00e9tu00e9 effectuu00e9.`;
    } else if (status === PAYMENT_STATUS.PROCESSED) {
      notificationTitle = 'Paiement en cours de traitement';
      notificationMessage = `Votre paiement de ${payment.amount} MAD est en cours de traitement.`;
    }

    if (notificationTitle) {
      await createNotification(
        payment.candidate,
        'payment',
        notificationTitle,
        notificationMessage,
        { application: payment.application, mission: payment.mission }
      );
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la mise u00e0 jour du statut du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise u00e0 jour du statut du paiement'
    });
  }
};

/**
 * @desc    Obtenir tous les paiements d'un employeur
 * @route   GET /api/payments/employer
 * @access  Private/Establishment
 */
const getEmployerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ employer: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'candidate',
        select: 'candidateProfile'
      })
      .populate({
        path: 'job',
        select: 'title'
      })
      .populate({
        path: 'application',
        select: 'status'
      })
      .populate({
        path: 'mission',
        select: 'title status'
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des paiements'
    });
  }
};

/**
 * @desc    Obtenir tous les paiements d'un candidat
 * @route   GET /api/payments/candidate
 * @access  Private/Candidate
 */
const getCandidatePayments = async (req, res) => {
  try {
    const payments = await Payment.find({ candidate: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'employer',
        select: 'establishmentProfile'
      })
      .populate({
        path: 'job',
        select: 'title'
      })
      .populate({
        path: 'application',
        select: 'status'
      })
      .populate({
        path: 'mission',
        select: 'title status'
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des paiements'
    });
  }
};

/**
 * @desc    Obtenir un paiement par son ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'employer',
        select: 'establishmentProfile email phone'
      })
      .populate({
        path: 'candidate',
        select: 'candidateProfile email phone'
      })
      .populate({
        path: 'job',
        select: 'title'
      })
      .populate({
        path: 'application',
        select: 'status'
      })
      .populate({
        path: 'mission',
        select: 'title description startDate endDate status'
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvu00e9'
      });
    }

    // Vu00e9rifier que l'utilisateur est autorisu00e9 u00e0 voir ce paiement
    if (
      payment.employer._id.toString() !== req.user.id &&
      payment.candidate._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 accu00e9der u00e0 ce paiement'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration du paiement'
    });
  }
};

/**
 * @desc    Obtenir les statistiques de paiement pour un employeur
 * @route   GET /api/payments/employer/stats
 * @access  Private/Establishment
 */
const getEmployerPaymentStats = async (req, res) => {
  try {
    // Statistiques des paiements par statut
    const paymentsByStatus = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
    ]);

    // Statistiques des paiements par mois
    const paymentsByMonth = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);

    // Statistiques des paiements par candidat
    const paymentsByCandidate = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      {
        $group: {
          _id: '$candidate',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    // Ru00e9cupu00e9rer les informations des candidats
    const candidateIds = paymentsByCandidate.map(item => item._id);
    const candidates = await User.find({ _id: { $in: candidateIds } })
      .select('candidateProfile.firstName candidateProfile.lastName');

    // Associer les noms des candidats aux statistiques
    const paymentsByCandidateWithNames = paymentsByCandidate.map(item => {
      const candidate = candidates.find(c => c._id.toString() === item._id.toString());
      return {
        ...item,
        candidateName: candidate
          ? `${candidate.candidateProfile.firstName} ${candidate.candidateProfile.lastName}`
          : 'Candidat inconnu'
      };
    });

    res.json({
      success: true,
      data: {
        paymentsByStatus,
        paymentsByMonth,
        paymentsByCandidate: paymentsByCandidateWithNames
      }
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des statistiques de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des statistiques de paiement'
    });
  }
};

/**
 * @desc    Obtenir les paiements d'une mission
 * @route   GET /api/payments/mission/:missionId
 * @access  Private
 */
const getMissionPayments = async (req, res) => {
  try {
    const { missionId } = req.params;

    // Vu00e9rifier que la mission existe
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission non trouvu00e9e'
      });
    }

    // Vu00e9rifier que l'utilisateur est autorisu00e9 u00e0 voir ces paiements
    if (
      mission.establishment.toString() !== req.user.id &&
      mission.candidate.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisu00e9 u00e0 accu00e9der aux paiements de cette mission'
      });
    }

    // Ru00e9cupu00e9rer les paiements
    const payments = await Payment.find({ mission: missionId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'employer',
        select: 'establishmentProfile.name'
      })
      .populate({
        path: 'candidate',
        select: 'candidateProfile.firstName candidateProfile.lastName'
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration des paiements de la mission:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la ru00e9cupu00e9ration des paiements de la mission'
    });
  }
};

module.exports = {
  createPayment,
  createMissionPayment,
  updatePaymentStatus,
  getEmployerPayments,
  getCandidatePayments,
  getPaymentById,
  getEmployerPaymentStats,
  getMissionPayments
};
