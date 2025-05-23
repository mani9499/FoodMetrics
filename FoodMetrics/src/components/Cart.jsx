import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Orders from "./Orders";
import axios from "axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(items);
  }, []);

  useEffect(() => {
    const price = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const quantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(price);
    setQuantity(quantity);
  }, [cartItems]);

  const addToOrders = async () => {
    const username = localStorage.getItem("email");

    try {
      const orderItems = cartItems.map((item) => ({
        foodId: item._id,
        quantity: item.quantity,
      }));
      if (totalQuantity == 0) {
        alert("Nothing to order");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders`,
          {
            foodItems: [...orderItems],
            username,
            totalPrice,
            quantity: totalQuantity,
          }
        );

        if (response.status === 201) {
          alert("Order placed successfully!");
          localStorage.removeItem("cartItems");
          setCartItems([]);
          setTotalPrice(0);
          setQuantity(0);
        }
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="cart">
      <center>
        <span className="icon-label">
          <i className="ri-shopping-cart-line"></i>
          <span>Orders</span>
        </span>
      </center>
      <>
        <button
          onClick={() => navigate("/")}
          style={{
            margin: "1rem",
            padding: "0.5rem",
            borderRadius: "5px",
            backgroundColor: "#009",
            color: "#fff",
            border: "none",
          }}
        >
          <i className="ri-arrow-left-line"></i>
          <span>Back</span>
        </button>
      </>
      <div className="orders">
        <div className="Total-cart">
          <p>Total Items: {totalQuantity}</p>
          <p>Total Price: ₹{totalPrice}</p>
          <button onClick={() => addToOrders()}>Check Out</button>
        </div>
        <div className="previous-orders">
          <Orders />
        </div>
        <div className="current-orders">
          <div className="cart-heading">
            <span>Food</span>
            <span>Details</span>
          </div>
          {cartItems.length === 0 ? (
            <p style={{ padding: "1rem", color: "#009", fontWeight: "bold" }}>
              No items in the cart.
            </p>
          ) : (
            cartItems.map((item, index) => (
              <div className="order-item" key={item._id || index}>
                <img src={item.imageUrl} alt={item.name} />
                <div className="order-details">
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                  <span className="price">₹{item.price} /-</span>
                </div>
                <div className="billing-details">
                  <span className="quantity">{item.quantity}</span>
                  <span className="total-price">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
                <button
                  className="remove-item"
                  onClick={() => {
                    const updatedCartItems = cartItems.filter(
                      (cartItem) => cartItem._id !== item._id
                    );
                    setCartItems(updatedCartItems);
                    localStorage.setItem(
                      "cartItems",
                      JSON.stringify(updatedCartItems)
                    );
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
