const Payment = require('../models/Payment');
const Application = require('../models/Application');
const User = require('../models/User');
const Mission = require('../models/Mission');
const WorkHours = require('../models/WorkHours');
const { PAYMENT_STATUS } = require('../config/constants');
const { createNotification } = require('./notificationController');

/**
 * @desc    Créer un nouveau paiement
 * @route   POST /api/payments
 * @access  Private/Establishment
 */
const createPayment = async (req, res) => {
  try {
    const { applicationId, amount, hoursWorked, paymentMethod, paymentDetails } = req.body;

    // Vérifier que l'application existe
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien l'employeur
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à créer un paiement pour cette candidature'
      });
    }

    // Créer le paiement
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

    // Créer une notification pour le candidat
    await createNotification(
      application.candidate._id,
      'payment',
      'Nouveau paiement en attente',
      `Un paiement de ${amount} MAD a été créé pour votre travail chez ${req.user.establishmentProfile?.name || 'l\'établissement'}.`,
      { application: applicationId }
    );

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du paiement'
    });
  }
};

/**
 * @desc    Mettre à jour le statut d'un paiement
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
        message: 'Paiement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est bien l'employeur
    if (payment.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce paiement'
      });
    }

    // Mettre à jour le statut
    payment.status = status;
    if (status === PAYMENT_STATUS.PAID) {
      payment.paymentDate = paymentDate || Date.now();
    }

    await payment.save();

    // Créer une notification pour le candidat
    let notificationTitle, notificationMessage;
    if (status === PAYMENT_STATUS.PAID) {
      notificationTitle = 'Paiement effectué';
      notificationMessage = `Votre paiement de ${payment.amount} MAD a été effectué.`;
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
        { application: payment.application }
      );
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du statut du paiement'
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
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des paiements'
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
      });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des paiements'
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
        select: 'establishmentProfile'
      })
      .populate({
        path: 'candidate',
        select: 'candidateProfile'
      })
      .populate({
        path: 'job',
        select: 'title location salary'
      })
      .populate({
        path: 'application',
        select: 'status appliedAt'
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'employeur ou le candidat
    if (payment.employer._id.toString() !== req.user.id && payment.candidate._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à ce paiement'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération du paiement'
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
    // Total des paiements
    const totalPayments = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      { $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Paiements par statut
    const paymentsByStatus = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      { $group: {
          _id: "$status",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Paiements par mois
    const paymentsByMonth = await Payment.aggregate([
      { $match: { employer: req.user._id } },
      { $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        total: totalPayments.length > 0 ? totalPayments[0] : { total: 0, count: 0 },
        byStatus: paymentsByStatus,
        byMonth: paymentsByMonth
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

/**
 * @desc    Créer un paiement lié à une mission
 * @route   POST /api/payments/mission
 * @access  Private/Establishment
 */
const createMissionPayment = async (req, res) => {
  try {
    const { missionId, amount, paymentMethod, paymentDetails } = req.body;
    const userId = req.user.id;

    // Vérifier que la mission existe
    const mission = await Mission.findById(missionId)
      .populate('candidate')
      .populate('establishment');

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien l'établissement associé à cette mission
    if (mission.establishment._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à créer un paiement pour cette mission'
      });
    }

    // Créer le paiement
    const payment = await Payment.create({
      mission: missionId,
      candidate: mission.candidate._id,
      employer: userId,
      amount,
      paymentMethod,
      paymentDetails,
      status: PAYMENT_STATUS.PENDING,
      type: 'mission'
    });

    // Créer une notification pour le candidat
    await createNotification({
      recipient: mission.candidate._id,
      sender: userId,
      type: 'payment_created',
      message: `Un paiement de ${amount} DH a été créé pour votre mission: ${mission.title}`,
      relatedModel: 'Payment',
      relatedId: payment._id
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement pour la mission:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du paiement pour la mission'
    });
  }
};

/**
 * @desc    Obtenir les paiements liés à une mission
 * @route   GET /api/payments/mission/:missionId
 * @access  Private
 */
const getMissionPayments = async (req, res) => {
  try {
    const { missionId } = req.params;
    const userId = req.user.id;

    // Vérifier que la mission existe
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission non trouvée'
      });
    }

    // Vérifier que l'utilisateur est soit le candidat soit l'établissement associé à cette mission
    if (mission.candidate.toString() !== userId && mission.establishment.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'êtes pas autorisé à voir les paiements pour cette mission'
      });
    }

    // Récupérer les paiements
    const payments = await Payment.find({ mission: missionId })
      .populate('candidate', 'firstName lastName avatar')
      .populate('employer', 'companyName logo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements de la mission:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des paiements de la mission'
    });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getEmployerPayments,
  getCandidatePayments,
  getPaymentById,
  getEmployerPaymentStats,
  createMissionPayment,
  getMissionPayments
};
