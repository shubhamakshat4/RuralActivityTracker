import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function AdminLogin(){

  const [password,setPassword]=useState("");

  const navigate = useNavigate();

  const login=()=>{

    if(password==="JaiGuruDev@108"){

      localStorage.setItem("admin","true");

      navigate("/admin");

    }else{

      alert("Wrong Password");

    }

  };

  return(

    <div className="loginPage">

      <div className="loginCard">

        <img
          src="/ssu-logo.png"
          className="loginLogo"
        />

        <h1 className="loginTitle">
          Admin Login
        </h1>

        <p className="loginSubtitle">
          Rural Activity Tracker
        </p>

        <input
          type="password"
          className="loginInput"
          placeholder="Enter Admin Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button
          className="loginBtn"
          onClick={login}
        >
          Login
        </button>

      </div>

    </div>

  );

}