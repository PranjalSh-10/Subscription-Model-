import React, { useEffect, useState } from "react";
import { useSendData } from "../../helper/util";
import sortImage from "../../assets/images/sort.png";
import {
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaCalendarAlt,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
  FaListAlt,
  FaDollarSign,
  FaCreditCard,
  FaHourglassHalf,
  FaFilter
} from "react-icons/fa";
import classes from "./Styling.module.css";

interface Payment {
  id: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: string;
}

const Info: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [planName, setPlanName] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const sendData = useSendData();

  const fetchPaymentHistory = async () => {
    try {
      const response = await sendData(
        "GET",
        `get-transactions?page=${page}&limit=${limit}&keyword=${search}&planName=${planName}&status=${status}&paymentMethod=${paymentMethod}&isAsc=${sortAsc}`,
        true
      );
      setPayments(response.paymentHistory);
      setTotalPages(response.pagination.totalPages);
      console.log(response.paymentHistory);
    } catch (error) {
      setError("Error fetching payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [page, limit, sortAsc, search, planName, status, paymentMethod]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPaymentHistory();
  };

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
  };

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={classes.paymentTableContainer}>
      <form onSubmit={searchHandler} className={classes.form}>
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button type="submit">Search</button>
      </form>
      <div className={classes.controlsContainer}>
        <button onClick={toggleSortOrder} className={classes.sortButton}>
          <img src={sortImage} alt="sort" className={classes.sortImg} />
        </button>
        <button onClick={toggleFilter} className={classes.filterButton}>
          <FaFilter />
        </button>
      </div>
      {showFilters && (
        <div className={classes.filters}>
          <select value={planName} onChange={(e) => setPlanName(e.target.value)}>
            <option value="">All Plans</option>
            <option value="Pro">Pro</option>
            <option value="Starter">Starter</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Payment Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="initiated">Initiated</option>
            <option value="failed">Failed</option>
            
          </select>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="">Payment Method</option>
            <option value="card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
          <button onClick={() => setPage(1)}>Apply Filters</button>
        </div>
      )}
      <table className={classes.paymentTable}>
        <thead>
          <tr>
            <th>
              <FaIdBadge className={classes.icon} /> Transaction Id
            </th>
            <th>
              <FaUser className={classes.icon} /> User Name
            </th>
            <th>
              <FaEnvelope className={classes.icon} /> User Email
            </th>
            <th>
              <FaListAlt className={classes.icon} /> Plan Name
            </th>
            <th>
              <FaDollarSign className={classes.icon} /> Amount
            </th>
            <th>
              <FaCalendarAlt className={classes.icon} /> Date
            </th>
            <th>
              <FaCreditCard className={classes.icon} /> Payment Method
            </th>
            <th>
              <FaRegClock className={classes.icon} /> Status
            </th>
          </tr>
        </thead>
        <tbody>
          {payments &&
            payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.userName}</td>
                <td>{payment.userEmail}</td>
                <td>{payment.planName}</td>
                <td>{payment.amount}</td>
                <td>
                  {new Date(payment.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{payment.paymentMethod}</td>
                <td>
                  {payment.status === "succeeded" ? (
                    <FaCheckCircle className={classes.icon} style={{ color: "green" }} />
                  ) : payment.status === "failed" ? (
                    <FaTimesCircle className={classes.icon} style={{ color: "red" }} />
                  ) : (
                    <FaHourglassHalf className={classes.icon} style={{ color: "grey" }} />
                  )}
                  {payment.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={classes.pagination}>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Info;
