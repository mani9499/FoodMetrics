import React, { useState } from "react";
import Calorie_Meter from "./Calorie_Meter";
function Card({
  food_name = "unKnown",
  category = "unKnown",
  price = "0",
  imageUrl = "https://via.placeholder.com/150",
  calories = "0",
  onClick,
}) {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="Food-Card"
      onClick={onClick}
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

      <span className="price">{"₹" + price + " /-"}</span>
    </div>
  );
}
export default Card;
