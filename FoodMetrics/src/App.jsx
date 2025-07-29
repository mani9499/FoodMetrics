import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Daily from "./components/Daily";
import Weekly from "./components/Weekly";
import Monthly from "./components/Monthly";
import Yearly from "./components/Yearly";

import { NotifyProvider } from "./context/NotifyContext";
import Notify from "./components/Notify";

import "./App.css";

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/daily" element={<Daily />} />
      <Route path="/weekly" element={<Weekly />} />
      <Route path="/monthly" element={<Monthly />} />
      <Route path="/yearly" element={<Yearly />} />
    </Routes>
  );
}

export default function App() {
  return (
    <NotifyProvider>
      <Router>
        <Notify />
        <AppRoutes />
      </Router>
    </NotifyProvider>
  );
}
