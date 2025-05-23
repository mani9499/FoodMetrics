import React, { useState, useEffect } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("email");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );
        setOrders(response.data);
        console.log("Fetched orders:", response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    if (username) fetchOrders();
  }, [username]);

  return (
    <div>
      <h2>My Orders</h2>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-card">
              <p>#{index + 1}</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: {order.status}</p>
              <p>{order.quantity}</p>
              <p className="Total">₹ {order.totalPrice} /-</p>
              <button className="details">Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
