import React, { useEffect, useState } from 'react';
import { useSendData } from '../helper/utils';
import './Styling.css';
import { FaUser, FaEnvelope, FaIdBadge, FaCalendarAlt, FaRegClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  startDate: string;
  status: string;
}

const Info: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sendData = useSendData();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await sendData('GET', 'get-payment-info', true);
        // if (response.status === 500) {
          setPayments(response);
        // } else {
        //   setPayments(response);
        // }
      } catch (error) {
        setError('Error fetching payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return  (
    <div className="payment-table-container">
      <h2>Transactions Made</h2>
      <table className="payment-table">
        <thead>
          <tr>
            <th><FaIdBadge className="icon" />Transaction Id</th>
            <th><FaUser className="icon" />User Name</th>
            <th><FaEnvelope className="icon" />User Email</th>
            <th><FaCalendarAlt className="icon" />Plan Name</th>
            <th><FaCalendarAlt className="icon" />Start Date</th>
            <th><FaRegClock className="icon" />Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.userName}</td>
              <td>{payment.userEmail}</td>
              <td>{payment.planName}</td>
              <td>{new Date(payment.startDate).toLocaleDateString()}</td>
              <td>
                {payment.status === 'active' ? (
                  <FaCheckCircle className="icon" style={{ color: 'green' }} />
                ) : (
                  <FaTimesCircle className="icon" style={{ color: 'red' }} />
                )}
                {payment.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Info;
