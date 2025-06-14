import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../assets/logo.png";
export default function Login() {
  const [loginusername, setloginUsername] = useState("");
  const [loginpassword, setloginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handlesubmit = () => {
    if (isLogin) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/login`, {
          username: loginusername,
          password: loginpassword,
        })
        .then((response) => {
          if (response.status === 200) {
            const { message, user } = response.data;
            localStorage.setItem("name", user.name);
            localStorage.setItem("email", user.email);
            console.log(localStorage.getItem("name"), message);
            navigate("/");
          } else {
            alert("Invalid credentials");
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          alert("Invalid credentials");
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_API_URL}/register`, {
          email: username,
          password,
          name,
          phone,
        })
        .then((response) => {
          if (response.status === 201) {
            alert("Registration successful, please login.");
            setIsLogin(true);
          } else {
            alert("Registration failed");
          }
        })
        .catch((error) => {
          console.error("Error during registration:", error);
          alert("Registration failed");
        });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>FoodMetrics</h2>
        <input
          type="text"
          placeholder="Enter Email"
          value={isLogin ? loginusername : username}
          onChange={(e) => {
            isLogin
              ? setloginUsername(e.target.value)
              : setUsername(e.target.value);
          }}
        />
        {!isLogin && (
          <div className="additional-inputs">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </div>
        )}
        <div>
          <input
            type={showpassword ? "text" : "password"}
            placeholder="Enter password"
            value={isLogin ? loginpassword : password}
            onChange={(e) => {
              isLogin
                ? setloginPassword(e.target.value)
                : setPassword(e.target.value);
            }}
          />
          <i
            className={showpassword ? "ri-eye-off-line" : "ri-eye-line"}
            onClick={() => {
              setShowPassword(!showpassword);
            }}
          ></i>
        </div>
        <button type="submit" onClick={handlesubmit}>
          {isLogin ? "Login" : "Register"}
        </button>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
          }}
          className="inactive"
        >
          {!isLogin ? "Have an account? Login" : "New? Create an account"}
        </button>
      </div>
      <div className="website-intro">
        <img className="loginlogo" src={Logo} />
        <span className="intro">Hello, Welcome to FoodMetrics!</span>
        <p className="intro-subtext">
          Track your meals. Monitor your health. Live better.
        </p>
      </div>
    </div>
  );
}
