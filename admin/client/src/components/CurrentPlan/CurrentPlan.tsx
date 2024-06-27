import React, { useEffect, useState } from 'react';
import { useSendData } from '../helper/utils';
import './Styling.css';
import { FaUser, FaEnvelope, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';

interface Payment {
  userName: string;
  userEmail: string;
  planName: string;
  endDate: string;
}

const CurrentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const sendData = useSendData();

  useEffect(() => {
    const fetchCurrentPlans = async () => {
      try {
        const response = await sendData('GET', 'get-payment-info', true);
        setPayments(response);
      } catch (error) {
        setError('Error fetching current plans');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlans();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Function to filter current plans for each unique email ID
  const getCurrentPlansForUniqueEmails = () => {
    const currentDate = new Date();
    const uniqueEmails = Array.from(new Set(payments.map(payment => payment.userEmail)));
    const currentPlans = uniqueEmails.map(email => {
      const user = payments.find(payment => payment.userEmail === email);
      const plansForEmail = payments.filter(payment => payment.userEmail === email && new Date(payment.endDate) >= currentDate);
      return { userName: user?.userName, userEmail: email, currentPlans: plansForEmail.map(plan => plan.planName) };
    });
    return currentPlans;
  };

  const currentPlansForUniqueEmails = getCurrentPlansForUniqueEmails();

  return (
    <div className="table-container">
      <h2>Current Plans of Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th><FaIdBadge className="icon" />User</th>
            <th><FaUser className="icon" />User Name</th>
            <th><FaEnvelope className="icon" />User Email</th>
            <th><FaCalendarAlt className="icon" />Current Plans</th>
          </tr>
        </thead>
        <tbody>
          {currentPlansForUniqueEmails.map((userData, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{userData.userName}</td>
              <td>{userData.userEmail}</td>
              <td>{userData.currentPlans.length > 0 ? userData.currentPlans.join(', ') : 'No current plans'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentPage;
