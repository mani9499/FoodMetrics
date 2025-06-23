import React, { useState } from "react";
import Calorie_Meter from "./Calorie_Meter";
import { useNotify } from "../context/NotifyContext"; // ✅ import context

function Card({
  id = "unKnown",
  food_name = "unKnown",
  category = "unKnown",
  price = "0",
  imageUrl = "https://via.placeholder.com/150",
  calories = "0",
}) {
  const [isHover, setIsHover] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { showNotify } = useNotify(); // ✅ use notifier

  const countInc = () => {
    setQuantity((prev) => prev + 1);
  };

  const countDec = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem.food_name === food_name
    );

    const parsedQuantity = Number(quantity) || 1;

    if (existingIndex !== -1) {
      cartItems[existingIndex].quantity += parsedQuantity;
    } else {
      cartItems.push({
        id,
        food_name,
        category,
        price,
        imageUrl,
        calories,
        quantity: parsedQuantity,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    showNotify(`${food_name} added to cart`); // ✅ show notification
    setQuantity(1);
  };

  return (
    <div
      className="Food-Card"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="Food-Image-container">
        <img src={imageUrl} alt="Food" className="FoodImage" />
        <span className="category">{category}</span>
      </div>
      <div className="meter" style={{ display: isHover ? "block" : "none" }}>
        <Calorie_Meter value={calories} goal={800} />
      </div>
      <p>{food_name}</p>
      <div className="food-info">
        <span className="price">₹{price} /-</span>
        <div className="count">
          <div className="count-buttons">
            <button className="decrease" onClick={countDec}>
              -
            </button>
            <span className="count-value">{quantity}</span>
            <button className="increase" onClick={countInc}>
              +
            </button>
          </div>
        </div>
        <button onClick={addToCart}>Buy</button>
      </div>
    </div>
  );
}

export default Card;
