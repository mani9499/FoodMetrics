import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      <center>
        <h2>FOOD-METRICS</h2>
      </center>
      <div className="login-form">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
          }}
          className="inactive"
        >
          {!isLogin ? "Existing User" : "New User"}
        </button>
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
      </div>
    </div>
  );
}
