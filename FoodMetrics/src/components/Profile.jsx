import React, { useState, useEffect } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import Daily from "./Daily";
import Weekly from "./Weekly";
import Monthly from "./Monthly";
import Yearly from "./Yearly";

function Profile() {
  const navigate = useNavigate();
  const [AnalysisActive, setAnalysis] = useState("daily");
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  return (
    <div className="profile-container">
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("email");
          localStorage.removeItem("name");
          navigate("/login");
        }}
      >
        <i class="ri-logout-box-line"></i>
      </button>
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
          <button
            className={AnalysisActive === "daily" ? "active" : "inactive"}
            onClick={() => {
              setAnalysis("daily");
            }}
          >
            Daily
          </button>

          <button
            className={AnalysisActive === "weekly" ? "active" : "inactive"}
            onClick={() => {
              setAnalysis("weekly");
            }}
          >
            weekly
          </button>

          <button
            className={AnalysisActive === "monthly" ? "active" : "inactive"}
            onClick={() => {
              setAnalysis("monthly");
            }}
          >
            Monthly
          </button>

          <button
            className={AnalysisActive === "yearly" ? "active" : "inactive"}
            onClick={() => {
              setAnalysis("yearly");
            }}
          >
            Yearly
          </button>
        </div>
        <div className="Analysis-content">
          {AnalysisActive === "daily" && <Daily />}
          {AnalysisActive === "weekly" && <Weekly />}
          {AnalysisActive === "monthly" && <Monthly />}
          {AnalysisActive === "yearly" && <Yearly />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
