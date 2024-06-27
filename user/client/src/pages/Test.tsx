import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TestPage: React.FC = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(!token){
            navigate('/login');
        }
    })
  return (
    <div>
      <h1>succesful redirection</h1>
    </div>
  );
};

export default TestPage;
