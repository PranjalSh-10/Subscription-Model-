import React, { useState } from 'react';
import './Header.css';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdPayment } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import toast from 'react-hot-toast';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePlan = () => {
    navigate('/current-plan-details');
  };
  const handlePayment = () => {
    navigate('/payment-history');
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
    
    toast.success("successful logout");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="header">
      <div className="search">
        <input type="text" placeholder="search subscriptions here..." value={searchQuery}
          onChange={handleSearchChange} />
        <GrSearch className="search-icon" />
      </div>
      <div className="icons">
        <div className="user-icon" onClick={handlePlan}><FaRegCircleUser /></div>
        <div className="cart-icon" onClick={handlePayment}><MdPayment /></div>
        <div className="cart-icon" onClick={handleLogout}><FiLogOut /></div>
      </div>
    </div>
  );
}

export default Header;

