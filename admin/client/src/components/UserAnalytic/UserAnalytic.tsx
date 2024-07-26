import React, { useState, useEffect } from "react";
import { useSendData } from "../../helper/util";
import classes from "./UserAnalytic.module.css";
import sortImage from "../../assets/images/sort.png"
import Navbar from "../Navbar/Navbar";

interface IAccessResource {
  title: string;
  access: number;
}

export default function UserAnalytics() {
  <Navbar/>
  const [search, setSearch] = useState("");
  const [planName, setPlanName] = useState("");
  const [userAnalytics, setUserAnalytics] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const sendData = useSendData();

  async function fetchUserAnalytics() {
    
    try {
      let url = `user-analytics?page=${page}&limit=${limit}&keyword=${search}&isAsc=${sortAsc}`;
      if (planName) {
        url += `&planName=${planName}`;
      }
      // if (updatedAt) {
      //     url += `&updatedAt=${updatedAt}`;
      // }

      const response = await sendData("GET", url, true);
      setUserAnalytics(response.userDetails);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserAnalytics();
  }, [page, limit, search, planName, updatedAt, sortAsc]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUserAnalytics();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedAt(e.target.value);
  };

  const toggleSortOrder = () => {
    console.log("clicked")
    setSortAsc(prev => !prev);
  };

  return (
    <div>
      <form onSubmit={searchHandler} className={classes.form}>
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {setSearch(e.target.value); setPage(1)}}
        />
        <select
          value={planName}
          onChange={(e) => {setPlanName(e.target.value); setPage(1)}}
        >
          <option value="">All Plans</option>
          <option value="Pro">Pro</option>
          <option value="Starter">Starter</option>
          <option value="Free">Free</option>
        </select>
        {/* <input
                    type="date"
                    value={updatedAt}
                    onChange={handleDateChange}
                /> */}
        <button type="submit">Search</button>
      </form>
      <div className={classes.div}>
        <div className={classes.sortButtonContainer}>
          <button onClick={toggleSortOrder} className={classes.sortButton}>
            <img src={sortImage} alt='sort' className={classes.sortImg} />
          </button>
        </div>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>User Name</th>
              <th>User E-mail</th>
              <th>Subscription</th>
              <th>Total Number of resources</th>
              <th>Resources Left</th>
              <th>Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {userAnalytics.map((user) => (
              <tr key={user.userId}>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>{user.planName}</td>
                <td>
                  {user.totalResources.map(
                    (resource: IAccessResource, index: number) => (
                      <p key={index}>
                        {resource.title}: {resource.access}
                      </p>
                    )
                  )}
                </td>
                <td>
                  {user.leftResources.map(
                    (resource: IAccessResource, index: number) => (
                      <p key={index}>
                        {resource.title}: {resource.access}
                      </p>
                    )
                  )}
                </td>
                <td>{user.updatedDate}</td> {/* Displaying updatedDate */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={classes.pagination}>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}