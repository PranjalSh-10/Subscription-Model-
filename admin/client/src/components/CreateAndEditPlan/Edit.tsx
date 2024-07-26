import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSendData } from "../../helper/util";
import classes from "./Edit.module.css";
import styles from "./Edit.module.css";
import ResourcesModal from "./ResourcesModal";
import toast from "react-hot-toast";

interface CheckType {
  rId: string;
  access: number;
  checkProperty: boolean;
}

interface grpType{
  rId: string,
  access: number,
}


export default function EditForm() {
  const { id } = useParams();
  const [name, setName] = useState<string>("");
  const [resources, setResources] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [features, setFeatures] = useState<string>("");
  const [isChecked, setIsChecked] = useState<CheckType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any[]>([]);

  const navigate = useNavigate();
  const sendData = useSendData();

  useEffect(() => {
    async function fetchListOfPayment() {
      try {
        const res = await sendData(
          "GET",
          `manage-subscription/${id}`,
          true
        );
        console.log("hii");
        const resData=res.plan;
        console.log(resData);

        setName(resData.name);
        setDuration(resData.duration);
        setResources(resData.resources);
        setPrice(resData.price);
        setFeatures(resData.features);
        const updatedResources = resData.resourceArray.map((item: grpType) => ({
          ...item,
          checkProperty: true
        }));
        setIsChecked(updatedResources);
      } catch (err) {
        console.log(err);
      }
    }
    fetchListOfPayment();
  }, []);

  const editPlanHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resarr: grpType[] = [];
      let resources = 0;
      for (let i = 0; i < isChecked.length; i++) {
        if (isChecked[i].checkProperty) {
          resources++;
          resarr.push({rId:isChecked[i].rId, access: isChecked[i].access});
        }
      }

      if(resources===0){
        toast.error("Atleast one resource should be added");
        throw new Error("No resource added");
      }

      const data = {
        name: name,
        resources: resources,
        price: price,
        duration: duration,
        features: features,
        resourceArray: resarr,
      };
      const response = await sendData(
        "PUT",
        `manage-subscription/${id}`,
        true,
        data
      );
      navigate("/subscription-plans");
    } catch (err) {
      console.log(err);
    }
  };


  const handleCheckboxChange = (rId: string) => {
    setIsChecked((prev) => {
      const index = prev.findIndex((pr) => pr.rId === rId);
      if (index >= 0) {
        const updatedChecks = [...prev];
        updatedChecks[index] = {
          ...updatedChecks[index],
          access: !updatedChecks[index].checkProperty ? 1 : 0,
          checkProperty: !updatedChecks[index].checkProperty,
        };
        console.log("present");
        return updatedChecks;
      } 
      else {
        const newCheck = { rId, access:1, checkProperty: true };
        console.log("absent");
        return [...prev, newCheck];
      }
    });
    console.log(isChecked);
  };
  const handleAccessChange = (rId: string, access: number)=>{
    setIsChecked((prev) => {
      const index = prev.findIndex((pr) => pr.rId === rId);
      if (index >= 0) {
        const updatedChecks = [...prev];
        updatedChecks[index] = {
          ...updatedChecks[index],
          access: access,
          checkProperty: access>0,
        };
        console.log("present");
        return updatedChecks;
      } 
      else if(access>0){
        const newCheck = { rId, access, checkProperty: true };
        console.log("absent");
        return [...prev, newCheck];
      }
      return prev;
    });
  }

  const openModal = async () => {
    setIsModalOpen(true);

    try {

      const response = await sendData("GET", 'get-resources', true);

      setModalContent(response.resources);
    }
    catch (err) {
      console.error(err);
      // throw err;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className={classes.h1}>Edit the plan</h1>
      <form onSubmit={editPlanHandler} className={classes.form}>
        <label>Name of Plan:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Price of Plan(in Rs.):</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.valueAsNumber)}
          required
        />
        <label>Duration(in Months):</label>
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
          onChange={(e) => setFeatures(e.target.value)}
        />
        

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            margin: "0vh 0vw 2vh 0vw",
          }}
        >
          <div>
            <label>Add Resources:</label>
          </div>
          <div>
            <button
              type="button"
              style={{ margin: "0vh 0vw 0vh 2vw" }}
              onClick={openModal}
            >
              +
            </button>
          </div>
        </div>          
        <div className={classes.flexButton}>
          <div>
            <button type="submit" className={classes.editButton}>Save</button>
          </div>
          <div>
            <button type="button">
              <Link to="/subscription-plans">Cancel</Link>
            </button>
          </div>
        </div>
      </form>
      <ResourcesModal 
        show={isModalOpen} 
        closeModal={closeModal} 
        modalContent={modalContent} 
        handleCheckboxChange={handleCheckboxChange} 
        handleAccessChange={handleAccessChange}
        isChecked={isChecked}
        />
    </div>
  );
}
