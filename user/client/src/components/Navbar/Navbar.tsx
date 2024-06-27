import React from 'react';
import './Navbar.css';
import { FaRegCircleUser } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import { BiPurchaseTag } from "react-icons/bi";
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handlePlan = () => {
    navigate('/current-plan-details');
  };
  const handlePayment = () => {
    navigate('/payment-history');
  };
  const handleSubscription = () => {
    navigate('/Subscriptions');
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
    toast.success("succesfull logout");
  };
  

  return (
    <div className="header">
      <div className="icons">
        <div className="cart-icon" onClick={handlePlan}><FaRegCircleUser/></div>
        <div className="cart-icon" onClick={handlePayment}><MdPayment/></div>
        <div className="cart-icon" onClick={handleSubscription}><BiPurchaseTag/></div>
        <div className="cart-icon" onClick={handleLogout}><FiLogOut/></div>
       
      </div>
    </div>
  );
}

export default Navbar;

