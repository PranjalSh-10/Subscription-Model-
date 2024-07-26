import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "../Authentication.module.css";
import { useSendData } from "../../../helper/util";
import toast from 'react-hot-toast';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();
  const sendData = useSendData();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      console.log("error");
      return;
    }
    try {
      await sendData("POST", "register", false, { email, name, password });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.div} style={{ height: '98vh' }}>
      <h2 className={classes.h1}>Signup</h2>
      <form onSubmit={handleSubmit} className={classes.form}>
        {error}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={3}
            maxLength={30}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div className={classes.flex}>
          <button type="submit">Signup</button>
          <Link to="/login" className={classes.link}>
            Already have an account? Login here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
