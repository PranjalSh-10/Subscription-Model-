// import React from 'react';
// import './Navbar.css';
// import { FaRegCircleUser } from "react-icons/fa6";
// import { MdPayment } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import { FiLogOut } from "react-icons/fi";
// import { BiPurchaseTag } from "react-icons/bi";
// import toast from 'react-hot-toast';

// const Navbar: React.FC = () => {
//   const navigate = useNavigate();

//   const handlePlan = () => {
//     navigate('/current-plan-details');
//   };
//   const handlePayment = () => {
//     navigate('/payment-history');
//   };
//   const handleSubscription = () => {
//     navigate('/Subscriptions');
//   };
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate('/login');
//     toast.success("succesfull logout");
//   };
  

//   return (
//     <div className="header">
//       <div className="icons">
//         <div className="cart-icon" onClick={handlePlan}><FaRegCircleUser/></div>
//         <div className="cart-icon" onClick={handlePayment}><MdPayment/></div>
//         <div className="cart-icon" onClick={handleSubscription}><BiPurchaseTag/></div>
//         <div className="cart-icon" onClick={handleLogout}><FiLogOut/></div>
       
//       </div>
//     </div>
//   );
// }

// export default Navbar;

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
        <Link to="/subscriptions">Vegavid</Link>
      </div>
      <ul className={classes.navLinks}>
        <li>
          <Link to="/resources">Resources</Link>
        </li>
        <li>
          <Link to="/subscriptions">Subscription plans</Link>
        </li>
        <li>
          <Link to="/current-plan-details">Current plan</Link>
        </li>
        <li>
          <Link to="/payment-history">Payment history</Link>
        </li>
        <li>
          <Link to="/login" onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


