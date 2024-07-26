import React, { useEffect, useState } from "react";
import { useSendData } from "../../helper/util";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Plan.module.css";
import ResourceModal from "./ResourceModal";

export interface IAccessResource {
  _id: string;
  title: string;
  url: string;
  access: number;
}

export default function Plans() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<IAccessResource[]>([]);
  const navigate = useNavigate();
  const sendData = useSendData();

  const fetchSubscriptions = async () => {
    try {
      const res = await sendData("GET", "manage-subscription", true);
      const data = res.planData;
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
      const res = await sendData('DELETE', `manage-subscription/${id}`, true);
      const data = res.plans;
      console.log(data);
      await fetchSubscriptions();
    } catch (err) {
      console.log(err);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const openModal = async (planId:string) => {
    setIsModalOpen(true);
    try {
      const response = await sendData("GET", `get-plan-resources/${planId}`, true);
      setModalContent(response.resources);
    }
    catch (err) {
      console.error(err);
      // throw err;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent([]);
  };

  return (
    <div className={classes.container}>
      <br/>
      

      <Link to="/create" className={classes.link}>
        <div className={classes.newPlan}>+ Create New Plan</div>
      </Link>

      <ResourceModal modalContent={modalContent} isModalOpen={isModalOpen} closeModal={closeModal} /> 
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
                <i className="fas fa-database"></i>
                <span className={classes.resource} onClick={()=>{openModal(subscription._id)}}>Resources Available</span>
              </div>
              <div className={classes.cardDetail}>
                <span className={classes.price}>Rs. {subscription.price}</span>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <Link to={`/edit/${subscription._id}`} className={classes.editButton}>
                Edit
              </Link>
              <button
                onClick={() => deleteHandler(subscription._id)}
                className={classes.deleteButton}
              >
                Delete Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
