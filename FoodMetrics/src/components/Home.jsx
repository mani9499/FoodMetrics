import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import Notify from "./Notify";
const API_URL = import.meta.env.VITE_API_URL;
export default function Home() {
  const [food_itemList, setFoodList] = useState([]);
  const [filter, setFilter] = useState("All");
  const [notify, setNotify] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/food_items`)
      .then((response) => response.json())
      .then((data) => setFoodList(data))
      .catch((error) => console.error("error while fetching", error));
  }, []);
  const filteredFoodItems = food_itemList.filter((item) =>
    filter === "All" ? food_itemList : item.category === filter
  );
  const handleFilter = (category) => {
    setFilter(category);
  };
  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => {
        setNotify("");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [notify]);

  const navigate = useNavigate();
  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h2>FoodMetrics</h2>
        </div>
        {notify && <Notify message={notify} />}
      </header>
      <div className="hero-section">
        <button onClick={() => navigate("/orders")}>
          <i class="ri-restaurant-line"></i>My orders
        </button>
        <button className="cart-button" onClick={() => navigate("/cart")}>
          <i class="ri-shopping-cart-fill"></i>cart
        </button>
        <button>
          <i class="ri-speed-up-line"></i>Meter
        </button>
        <button onClick={() => navigate("/profile")}>
          <i class="ri-user-settings-fill"></i>profile
        </button>
      </div>

      <div className="Filter-section">
        <button>
          <i className="ri-filter-line"></i>
          {filter}
        </button>
        <ul className="Filter-content">
          <li onClick={() => handleFilter("All")}>All</li>
          <li onClick={() => handleFilter("Vegetarian")}>Vegetarian</li>
          <li onClick={() => handleFilter("Non-Vegetarian")}>Non-Vegetarian</li>
          <li onClick={() => handleFilter("Vegan")}>Vegan</li>
          <li onClick={() => handleFilter("Dessert")}>Dessert</li>
          <li onClick={() => handleFilter("Beverage")}>Beverage</li>
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
            setNotify={setNotify}
          />
        ))}
      </div>
    </div>
  );
}
