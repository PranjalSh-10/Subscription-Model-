import React, { useState } from 'react';
import classes from './Header.module.css';
import { GrSearch } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className={classes.header}>
      <div className={classes.search}>
        <input type="text" placeholder="search subscriptions here..." value={searchQuery}
          onChange={handleSearchChange} />
      </div>
    </div>
  );
}

export default Header;

