import React, { useEffect, useState } from "react";
import { useSendData } from "../../helper/util";
import classes from "./Styling.module.css";
import sortImage from "../../assets/images/sort.png";
import { FaUser, FaEnvelope, FaCalendarAlt, FaIdBadge } from "react-icons/fa";

interface Payment {
  userName: string;
  userEmail: string;
  planName: string;
  startDate: string;
}

const CurrentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const sendData = useSendData();

  useEffect(() => {
    const fetchCurrentPlans = async () => {
      try {
        const response = await sendData("GET", "get-current-plans", true);
        console.log(response);
        setPayments(response.paymentHistory);
      } catch (error) {
        setError("Error fetching current plans");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlans();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const toggleSortOrder = () => {
    setSortAsc((prev) => !prev);
    const sortedPayments = [...payments].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return sortAsc ? dateB - dateA : dateA - dateB;
    });
    setPayments(sortedPayments);
  };

  return (
    <div className={classes.tableContainer}>
      <h2>Current Plans of Users</h2>
      <div className={classes.sortButtonContainer}>
        <button onClick={toggleSortOrder} className={classes.sortButton}>
          <img src={sortImage} alt="sort" className={classes.sortImg} />
        </button>
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>
              <FaIdBadge className={classes.icon} />
              User
            </th>
            <th>
              <FaUser className={classes.icon} />
              User Name
            </th>
            <th>
              <FaEnvelope className={classes.icon} />
              User Email
            </th>
            <th>
              <FaCalendarAlt className={classes.icon} />
              Current Plans
            </th>
            <th>
              <FaCalendarAlt className={classes.icon} />
              Start Date
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((userData, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{userData.userName}</td>
              <td>{userData.userEmail}</td>
              <td>{userData.planName}</td>
              <td>{userData.startDate}</td>
              {/* <td>{userData.currentPlans.length > 0 ? userData.currentPlans.join(', ') : 'No current plans'}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentPage;
