import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calorie_Meter from "./Calorie_Meter";
import { useNotify } from "../context/NotifyContext";
import axios from "axios";

function Cart() {
  const { showNotify } = useNotify();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setQuantity] = useState(0);
  const [totalcalories, setTotalCalories] = useState(0);
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
    const totalcalories = cartItems.reduce(
      (acc, item) => acc + item.calories * item.quantity,
      0
    );
    const quantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setTotalPrice(price);
    setQuantity(quantity);
    setTotalCalories(totalcalories);
  }, [cartItems]);

  const addToOrders = async () => {
    const username = localStorage.getItem("email");
    const orderItems = cartItems.map((item) => ({
      foodId: item.id,
      quantity: item.quantity,
    }));

    if (totalQuantity == 0) {
      showNotify("Nothing to order");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        {
          foodItems: orderItems,
          totalPrice,
          quantity: totalQuantity,
          username,
        }
      );

      if (response.status === 201) {
        showNotify("Order placed successfully!");
        localStorage.removeItem("cartItems");
        setCartItems([]);
        setTotalPrice(0);
        setQuantity(0);
        navigate("/orders");
      } else {
        showNotify("Order failed. Try again.");
      }
    } catch (error) {
      console.error(
        "Error placing the order:",
        error.response || error.message
      );
      showNotify("Something went wrong. Please try again.");
    }
  };

  const removeFromCart = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  return (
    <div className="cart">
      <center>
        <span className="icon-label">
          <i className="ri-shopping-cart-line"></i>
          <span>Cart</span>
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
        <div className="current-orders">
          <div className="cart-heading">
            <span>Food</span>
            <span>Details</span>
            <span>Quantity</span>
            <span>Total Price</span>
          </div>
          {cartItems.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "1rem",
                color: "#009",
                fontWeight: "bold",
              }}
            >
              No items in the cart.
            </p>
          ) : (
            cartItems.map((item, index) => (
              <div className="order-item" key={item.id || index}>
                <img src={item.imageUrl} alt={item.food_name} />
                <div className="order-details">
                  <h3>{item.food_name}</h3>
                  <p>
                    {item.category} {item.calories} Cals
                  </p>
                  <span className="price">₹{item.price} /-</span>
                </div>
                <div className="quantity-controls">
                  <div>
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          const updatedItems = cartItems.map((cartItem) =>
                            cartItem.id === item.id
                              ? { ...cartItem, quantity: cartItem.quantity - 1 }
                              : cartItem
                          );
                          setCartItems(updatedItems);
                          localStorage.setItem(
                            "cartItems",
                            JSON.stringify(updatedItems)
                          );
                        }
                      }}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const updatedItems = cartItems.map((cartItem) =>
                          cartItem.id === item.id
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                        );
                        setCartItems(updatedItems);
                        localStorage.setItem(
                          "cartItems",
                          JSON.stringify(updatedItems)
                        );
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="ri-delete-bin-5-line"></i>
                  </button>
                </div>
                <span className="total-price">
                  ₹{item.price * item.quantity}/-
                </span>
              </div>
            ))
          )}
        </div>
        <div className="cart-meter">
          <h3>Calorie Meter</h3>
          <Calorie_Meter goal={2000} value={totalcalories} />
        </div>
      </div>
    </div>
  );
}

export default Cart;
