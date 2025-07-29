import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useNotify } from "../context/NotifyContext";
import Logo from "../assets/logo.png";
import { isTokenValid } from "../utils/jwt";

export default function Login() {
  const { showNotify } = useNotify();
  const [loading, setLoading] = useState(true);
  const [loginusername, setloginUsername] = useState("");
  const [loginpassword, setloginPassword] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isTokenValid(token)) {
      navigate("/", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handlesubmit = async () => {
    if (
      (isLogin && (!loginusername || !loginpassword)) ||
      (!isLogin && (!username || !password || !name || !phone))
    ) {
      showNotify("Please fill all fields.");
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/login`,
          {
            username: loginusername,
            password: loginpassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (response.status === 200) {
          const { message, token, user } = response.data;
          localStorage.setItem("name", user.name);
          localStorage.setItem("email", user.email);
          localStorage.setItem("token", token);
          console.log("Login successful:", message);
          navigate("/");
        }
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/register`,
          {
            email: username,
            password,
            name,
            phone,
          }
        );

        if (response.status === 201) {
          showNotify("Registration successful, please login.");
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      showNotify(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };
  if (loading) return null;
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>FoodMetrics</h2>
        <input
          type="text"
          placeholder="Enter Email"
          value={isLogin ? loginusername : username}
          onChange={(e) =>
            isLogin
              ? setloginUsername(e.target.value)
              : setUsername(e.target.value)
          }
        />
        {!isLogin && (
          <div className="additional-inputs">
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        )}
        <div>
          <input
            type={showpassword ? "text" : "password"}
            placeholder="Enter password"
            value={isLogin ? loginpassword : password}
            onChange={(e) =>
              isLogin
                ? setloginPassword(e.target.value)
                : setPassword(e.target.value)
            }
          />
          <i
            className={showpassword ? "ri-eye-off-line" : "ri-eye-line"}
            onClick={() => setShowPassword(!showpassword)}
          ></i>
        </div>
        <button type="submit" onClick={handlesubmit}>
          {isLogin ? "Login" : "Register"}
        </button>
        <button onClick={() => setIsLogin(!isLogin)} className="inactive">
          {!isLogin ? "Have an account? Login" : "New? Create an account"}
        </button>
      </div>
      <div className="website-intro">
        <img className="loginlogo" src={Logo} />
        <center>
          <span className="intro">Hello, Welcome to FoodMetrics!</span>
        </center>
        <p className="intro-subtext">
          Track your meals. Monitor your health. Live better.
        </p>
      </div>
    </div>
  );
}
