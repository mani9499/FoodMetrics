import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import Notify from "./Notify";
import { useNotify } from "../context/NotifyContext"; // ✅ context hook

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [food_itemList, setFoodList] = useState([]);
  const [filter, setFilter] = useState("All");
  const { showNotify } = useNotify(); // ✅ access context
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/food_items`)
      .then((response) => response.json())
      .then((data) => setFoodList(data))
      .catch((error) => {
        console.error("Error while fetching:", error);
        showNotify("Failed to fetch food items 😥");
      });
  }, []);

  const filteredFoodItems =
    filter === "All"
      ? food_itemList
      : food_itemList.filter((item) => item.category === filter);

  const handleFilter = (category) => {
    setFilter(category);
  };

  return (
    <div className="container">
      {/* ✅ Global Notification */}
      <Notify />

      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h2>FoodMetrics</h2>
        </div>
      </header>

      <div className="hero-section">
        <button onClick={() => navigate("/orders")}>
          <i className="ri-restaurant-line"></i> My orders
        </button>
        <button className="cart-button" onClick={() => navigate("/cart")}>
          <i className="ri-shopping-cart-fill"></i> Cart
        </button>
        <button onClick={() => navigate("/cart")}>
          <i className="ri-speed-up-line"></i> Meter
        </button>
        <button onClick={() => navigate("/profile")}>
          <i className="ri-user-settings-fill"></i> Profile
        </button>
      </div>

      <div className="Filter-section">
        <button>
          <i className="ri-filter-line"></i> {filter}
        </button>
        <ul className="Filter-content">
          {[
            "All",
            "Vegetarian",
            "Non-Vegetarian",
            "Vegan",
            "Dessert",
            "Beverage",
          ].map((cat) => (
            <li key={cat} onClick={() => handleFilter(cat)}>
              {cat}
            </li>
          ))}
        </ul>
      </div>

      <div className="Card-Container">
        {filteredFoodItems.map((item, index) => (
          <Card
            key={index}
            id={item._id}
            food_name={item.name}
            category={item.category}
            price={item.price}
            imageUrl={item.imageUrl}
            calories={item.calories}
          />
        ))}
      </div>
    </div>
  );
}
