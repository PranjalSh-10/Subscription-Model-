import React, { useState, useEffect } from "react";
import { useSendData } from "../../helper/util";
import classes from "./PaymentHistory.module.css";
import sortImage from "../../assets/images/sort.png";
import { useNavigate } from "react-router-dom";

export default function PaymentHistory() {
  const [listOfPayment, setListOfPayment] = useState<any[]>([]);
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const navigate = useNavigate();
  const sendData = useSendData();

  useEffect(() => {
    async function fetchListOfPayment() {
      try {
        const resData = await sendData('GET',"payment-history", true);
        const res=resData.response;
        
        if (Array.isArray(res)) {
          setListOfPayment(res);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchListOfPayment();
  },[]);

  const toggleSortOrder = () => {
    setSortAsc(!sortAsc);
    const sortedPayments = [...listOfPayment].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortAsc ? dateB - dateA : dateA - dateB;
    });
    setListOfPayment(sortedPayments);
  };


  return (
    <div className={classes.div}>
      <h1 className={classes.h1}>Payment History</h1>
      <div className={classes.sortButtonContainer}>
        <button onClick={toggleSortOrder} className={classes.sortButton}>
          <img src={sortImage} alt="sort" className={classes.sortImg} />
        </button>
      </div>
      <ul className={classes.ul}>
        {listOfPayment.length === 0 && (
          <p className={classes.noPayments}>No transactions yet.</p>
        )}
        {listOfPayment.length !== 0 &&
          listOfPayment.map((payment,index) => {
            return (
              <li className={classes.payment} key={index}>
                <h2>Rs. {payment.amount}</h2>
                <p>{payment.name} Plan</p>
                <p>Payment was done on {payment.date}</p>
                {/* Payment was done on {payment.date.getDate()}-{payment.date.getMonth()+1}-{payment.date.getYear()+1} */}
                {/* <h2 className={classes.paymentDesc}>{payment}</h2> */}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
