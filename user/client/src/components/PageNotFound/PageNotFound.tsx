import React from 'react';
import { Link } from 'react-router-dom';
import classes from './PageNotFound.module.css';

const PageNotFound: React.FC = () => {
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>404</h1>
      <p className={classes.message}>Page Not Found</p>
      <Link to="/Subscriptions" className={classes.homeLink}>Go to Website</Link>
    </div>
  );
};

export default PageNotFound;
