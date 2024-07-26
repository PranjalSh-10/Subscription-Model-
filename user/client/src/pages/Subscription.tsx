import React from "react";
import Subscription from "../components/Subscription/Subscription";
import Navbar from "../components/Navbar/Navbar";
import classes from "../components/Subscription/Subscription.module.css";

const SubscriptionPage: React.FC = () => {
  return (
    <div className={classes.Subscription_Page}>
      <Navbar />
      <Subscription />
    </div>
  );
};

export default SubscriptionPage;
