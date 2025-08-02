import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FaMoneyBillWave, FaPlus, FaFileInvoice } from 'react-icons/fa';
import CreateMissionPaymentForm from './CreateMissionPaymentForm';

const MissionPayments = ({ missionId, userType }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/payments/mission/${missionId}`);
        setPayments(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des paiements:', err);
        setError('Impossible de charger les paiements. Veuillez ru00e9essayer plus tard.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [missionId]);

  const handlePaymentCreated = (newPayment) => {
    setPayments([newPayment, ...payments]);
    setShowCreateForm(false);
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      await axios.put(`/api/payments/${paymentId}/status`, { 
        status: newStatus,
        paymentDate: newStatus === 'Payu00e9' ? new Date() : null
      });
      
      // Mettre u00e0 jour la liste localement
      setPayments(payments.map(payment => 
        payment._id === paymentId ? { ...payment, status: newStatus } : payment
      ));
    } catch (err) {
      console.error('Erreur lors de la mise u00e0 jour du statut du paiement:', err);
      alert('Impossible de mettre u00e0 jour le statut du paiement.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Non du00e9finie';
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Payu00e9':
        return <span className="badge bg-success">Payu00e9</span>;
      case 'Traitu00e9':
        return <span className="badge bg-primary">Traitu00e9</span>;
      default:
        return <span className="badge bg-warning">En attente</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="mission-payments">
      {userType === 'establishment' && (
        <div className="mb-4">
          {!showCreateForm ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateForm(true)}
            >
              <FaPlus className="me-2" /> Cru00e9er un nouveau paiement
            </button>
          ) : (
            <CreateMissionPaymentForm 
              missionId={missionId} 
              onPaymentCreated={handlePaymentCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          )}
        </div>
      )}

      {payments.length === 0 ? (
        <div className="alert alert-info">
          Aucun paiement enregistru00e9 pour cette mission.
        </div>
      ) : (
        <div className="row">
          {payments.map(payment => (
            <div className="col-md-6 mb-4" key={payment._id}>
              <div className={`card payment-card border-${payment.status === 'Payu00e9' ? 'success' : payment.status === 'Traitu00e9' ? 'primary' : 'warning'}`}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0"><FaMoneyBillWave className="me-2" /> Paiement #{payment.invoiceNumber || payment._id.substring(0, 8)}</h5>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="card-body">
                  <div className="payment-amount mb-3">{payment.amount} MAD</div>
                  <p><strong>Pu00e9riode:</strong> {formatDate(payment.periodStart)} - {formatDate(payment.periodEnd)}</p>
                  <p><strong>Heures facturees:</strong> {payment.hoursWorked}h</p>
                  <p><strong>Mu00e9thode de paiement:</strong> {payment.paymentMethod}</p>
                  {payment.paymentDate && (
                    <p><strong>Date de paiement:</strong> {formatDate(payment.paymentDate)}</p>
                  )}
                  {payment.dueDate && (
                    <p><strong>Date d'u00e9chu00e9ance:</strong> {formatDate(payment.dueDate)}</p>
                  )}
                </div>
                {userType === 'establishment' && payment.status !== 'Payu00e9' && (
                  <div className="card-footer">
                    <div className="btn-group w-100">
                      {payment.status === 'En attente' && (
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleStatusUpdate(payment._id, 'Traitu00e9')}
                        >
                          Marquer comme traitu00e9
                        </button>
                      )}
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleStatusUpdate(payment._id, 'Payu00e9')}
                      >
                        Marquer comme payu00e9
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MissionPayments;
