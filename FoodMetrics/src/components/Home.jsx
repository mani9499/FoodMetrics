import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetCount from "./GetCount";
import logo from "../assets/logo.png";
import Card from "./Card";
const API_URL = import.meta.env.VITE_API_URL;
export default function Home() {
  const navigate = useNavigate();
  const [food_itemList, setFoodList] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [displaycount, setDisplayCount] = useState("none");
  const [curr_item, setCurrItem] = useState({});
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
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

  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="user-icon">
          <button>
            <i className="ri-search-line"></i>
          </button>
          <button onClick={() => navigate("/cart")}>
            <i className="ri-shopping-cart-line"></i>
          </button>
          <button>
            <div className="Menu" onClick={handleMenuToggle}>
              {isMenuOpen ? (
                <i className="ri-close-large-line"></i>
              ) : (
                <i className="ri-menu-line"></i>
              )}
              <ul className={isMenuOpen ? "menu-open" : "menu-close"}>
                <li>Home</li>
                <li>About</li>
                {localStorage.getItem("email") == undefined ? (
                  <li onClick={() => navigate("/login")}>login</li>
                ) : (
                  <li
                    onClick={() => {
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      navigate("/Login");
                    }}
                  >
                    logout
                  </li>
                )}
              </ul>
            </div>
          </button>
        </div>
      </header>
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
      {displaycount === "block" && (
        <div className="overlay" onClick={() => setDisplayCount("none")}>
          <div className="count-popup" onClick={(e) => e.stopPropagation()}>
            <GetCount item={curr_item} setDisplayCount={setDisplayCount} />
          </div>
        </div>
      )}

      <div className="Card-Container">
        {filteredFoodItems.map((item, index) => (
          <Card
            key={index}
            food_name={item.name}
            category={item.category}
            price={item.price}
            imageUrl={item.imageUrl}
            calories={item.calories}
            onClick={() => {
              setDisplayCount("block");
              setCurrItem(item);
            }}
          />
        ))}
      </div>
    </div>
  );
}
