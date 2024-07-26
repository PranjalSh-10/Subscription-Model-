import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "../Authentication.module.css";
import { useSendData } from "../../../helper/util";
// import { sendData } from "../../../helper/util";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const sendData = useSendData();

  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = { email: email, password: password };
      const response = await sendData('POST', 'login', false, data);

      if(response.token){
        localStorage.setItem('token', response.token);
      }
      else{
        throw new Error('Authentication failed');
      }
      navigate("/subscription-plans");
    } catch (err) {
      console.log(err);
    }
    // if (response) {
    //   invalidInput = <p>Invalid Email or Password!</p>;
    // }
  };

  return (
    <div className={classes.div}>
      <h1 className={classes.h1}>Login</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        {error}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className={classes.flex}>
          <div>
            <button type="submit">Login</button>
          </div>
          {/* <div>
            <Link to="/register" className={classes.link}>
              Don't have an account? Create one!
            </Link>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
