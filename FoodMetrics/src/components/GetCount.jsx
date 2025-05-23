import React, { useState, useEffect } from "react";

function GetCount({ item, setDisplayCount }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item]);

  const countInc = () => {
    setQuantity((prev) => prev + 1);
  };

  const countDec = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingIndex = cartItems.findIndex(
      (cartItem) => cartItem._id === item._id
    );

    if (existingIndex !== -1) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({ ...item, quantity });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert("Item added to cart!");
    setQuantity(1);
    setDisplayCount("none");
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="getCounter">
      <button className="close" onClick={() => setDisplayCount("none")}>
        x
      </button>
      <img src={item.imageUrl} alt="Food" />
      <h4>{item.name}</h4>
      <div className="count-buttons">
        <button className="Decrease" onClick={countDec}>
          <i class="ri-subtract-line"></i>
        </button>
        <span className="counter">{quantity}</span>
        <button className="Increase" onClick={countInc}>
          <i class="ri-add-large-fill"></i>
        </button>
      </div>
      <button className="AddToCart" onClick={addToCart}>
        <i class="ri-shopping-cart-fill"></i>
      </button>
    </div>
  );
}

export default GetCount;
