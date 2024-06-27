import React, { useEffect, useState } from 'react';
import { useSendData } from '../../helper/util';
// import { sendData } from '../../helper/util';
import classes from './CurrentPlan.module.css';
import { useNavigate } from 'react-router-dom';

interface Plan {
  planName: string;
  purchaseDate: string;
  duration: number;
  remainingResources: number;
  remainingDuration: string;
}

export default function CurrentPlan() {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  // const [shouldFetchPlan, setShouldFetchPlan] = useState<boolean>(false);
  const sendData = useSendData();

  async function fetchCurrentPlan() {
    try {
      const resData = await sendData("GET", "current-plan-details", true);
      const response = resData.currentPlanDetails;
      setCurrentPlan(response);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const unsubscribeHandler = async (planName: string = "", leftResources: number = 0) => {
    try {
      const resData = await sendData("POST", "unsubscribe", true, { planName: planName, leftResources: leftResources });
      await fetchCurrentPlan();
    }
    catch (err) {
      console.log(err);
      // window.alert(err);
    }
  }

  return (
    <div className={classes.div}>
      <h1 className={classes.h1}>Current Plan Details</h1>
      {(
        <div className={classes.planContainer}>
          {!currentPlan ? (
            <h1 style={{ color: "white" }}>Not Subscribed to any Plan</h1>
          ) : (
            <>
              <h1 style={{ color: "black" }}>{currentPlan.planName} Plan</h1>
              <p>Purchase Date: {currentPlan.purchaseDate}</p>
              <p>Duration: {currentPlan.duration} Months</p>
              <p>Remaining resources: {currentPlan.remainingResources==-1 ? "Unlimited": currentPlan.remainingResources}</p>
              <p>Remaining duration: {currentPlan.remainingDuration} Days</p>
              <button onClick={() => unsubscribeHandler(currentPlan.planName, currentPlan.remainingResources)}>Unsubscribe</button>
            </>
          )}</div>
      )}
    </div>
  );
}
