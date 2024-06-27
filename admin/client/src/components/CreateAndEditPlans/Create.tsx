import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendData } from "../helper/utils";
import classes from "./Create.module.css";

export default function CreateForm() {
  const [name, setName] = useState<string>("");
  const [features, setfeatures] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [resources, setResources] = useState<number>(0);
  const sendData = useSendData();
  
  const navigate = useNavigate();
  const createPlanHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        name: name,
        features: features,
        price: price,
        duration: duration,
        resources: resources,
      };
      const response = await sendData(
        "POST",
        "manage-subscription",
        true,
        data
      );
      navigate("/subscription-plans");
    } catch (err) {
      console.log(err);
      window.alert(err);
    }
  };

  return (
    <div>
      <h1 className={classes.h1}>Create a new Plan</h1>
      <form onSubmit={createPlanHandler} className={classes.form}>
        <label>Name of Plan:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Number of resources:</label>
        <input
          type="number"
          value={resources}
          onChange={(e) => setResources(e.target.valueAsNumber)}
          required
        />
        <label>Price of Plan:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.valueAsNumber)}
          required
        />
        <label>Duration:</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.valueAsNumber)}
          required
        />
        <label>Features(Optional):</label>
        <input
          type="text"
          value={features}
          onChange={(e) => setfeatures(e.target.value)}
        />
        <button>Create Plan</button>
      </form>
    </div>
  );
}
