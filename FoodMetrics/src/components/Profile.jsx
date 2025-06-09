import React, { useState } from "react";
import "./profile.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  return (
    <div className="profile-container">
      <div className="profile">
        <button
          onClick={() => navigate("/")}
          style={{
            margin: "1rem",
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#009",
            color: "#fff",
            border: "none",
          }}
        >
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </button>
        <div className="profile-head">
          <h2>
            {name}
            <i className="ri-user-3-fill"></i>
          </h2>
          <p>
            <i class="ri-mail-fill"></i>
            {email}
          </p>
        </div>

        <h2>Dashboard</h2>
        <div className="Analysis">
          <button>Daily</button>

          <button>weekly</button>

          <button>Monthly</button>

          <button>Yearly</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
