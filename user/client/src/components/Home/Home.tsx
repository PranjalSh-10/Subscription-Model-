import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./Home.module.css";

export default function Home() {
  return (
    <div className={classes.div}>
      <h1 className={classes.h1}>Welcome!</h1>
      <p className={classes.p}>
        To access the resources or start a subscription either login or signup.
      </p>
      <div className={classes.flex}>
        <NavLink to="/login" className={classes.button}>
          Login
        </NavLink>
        <NavLink
          to="/register"
          className={classes.button}
        >
          Signup
        </NavLink>
      </div>
    </div>
  );
}
