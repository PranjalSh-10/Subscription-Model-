import React, { useEffect, useState } from "react";
import { useSendData } from "../helper/utils";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Plans.module.css";

export default function Plans() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const navigate = useNavigate();
  const sendData = useSendData();

  const fetchSubscriptions = async () => {
    try {
      const data = await sendData("GET", "manage-subscription", true);
      console.log(data);
      if (Array.isArray(data)) {
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const deleteHandler = async (id: string) => {
    try {
      const response = await sendData('DELETE', `manage-subscription/${id}`, true);
      await fetchSubscriptions();
    }
    catch (err) {
      console.log(err);
      window.alert(err);
    }
  };



  const openSidebar = () => {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      sidebar.style.width = "250px";
    }
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById("mySidebar");
    if (sidebar) {
      sidebar.style.width = "0";
    }
  };




  return (
    <div className={classes.container}>


<div className={classes.hamburger} onClick={openSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div id="mySidebar" className={classes.sidebar}>
        <a href="javascript:void(0)" className={classes.closebtn} onClick={closeSidebar}>
          &times;
        </a>
        <Link to="/current-plans">Current Plan</Link>
        <Link to="/PaymentInfo">Transaction History</Link>
      </div>


      <Link to="/create" className={classes.link}>
        <div className={classes.newPlan}>+ Create New Plan</div>
      </Link>
      <h2 className={classes.h2}>Available Subscriptions :</h2>
      <div className={classes.cards}>
        {subscriptions.map((subscription) => (
          <div key={subscription._id} className={classes.card}>
            <div className={classes.header}>
              <h3 className={classes.name}>{subscription.name}</h3>
            </div>
            <div className={classes.cardBody}>
              <div className={classes.cardDetail}>
                <i className="fas fa-clock"></i>
                <span>Duration: {subscription.duration} months</span>
              </div>
              <div className={classes.cardDetail}>
                <i className="fas fa-database"></i>
                <span>
                  {subscription.resources === -1
                    ? "Unlimited Resource Access"
                    : `${subscription.resources} Resource Access`}
                </span>
              </div>
              <div className={classes.cardDetail}>
                <span className={classes.price}>${subscription.price} USD</span>
              </div>
            </div>
            <Link to={`/edit/${subscription._id}`} className={classes.link}>
              Edit
            </Link>
            <button
              onClick={() => deleteHandler(subscription._id)}
              className={classes.deleteButton}
            >
              Delete Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}