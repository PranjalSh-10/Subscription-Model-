import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("succesfull logout");
      };

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <Link to="/subscription-plans">Vegavid</Link>
      </div>
      <ul className={classes.navLinks}>
        
        <li>
        <Link to="/subscription-plans">Manage Subscription</Link>
        </li>
        <li>
        <Link to="/user-analytics">User Analytics</Link>
        </li>
        <li>
        <Link to="/plan-analytics">Plan Analytics</Link>
        </li>
        <li>
        <Link to="/PaymentInfo">Transaction History</Link>
        </li>
        <li>
        <Link to="/" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


