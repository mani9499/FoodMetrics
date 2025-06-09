import React, { useState, useEffect } from "react";
import axios from "axios";
import Calorie_Meter from "./Calorie_Meter";
import "./Style.css";
import { useNavigate } from "react-router-dom";
function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [displayOrderid, setDisplayOrderid] = useState(null);
  const [foodList, setFoodList] = useState([]);

  const display = (orderid) => {
    if (displayOrderid === orderid) {
      setDisplayOrderid(null);
      return;
    }
    setCurrentOrder(orders.find((order) => order._id === orderid));
    setDisplayOrderid(orderid);
  };
  useEffect(() => {
    const fetchFoodList = async () => {
      if (currentOrder) {
        const foodIds = currentOrder.foodItems.map((item) => item.foodId);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/foods`, {
          ids: foodIds,
        });
        const data = res.data;
        const merged = data.map((item) => {
          const match = currentOrder.foodItems.find(
            (f) => f.foodId === item._id
          );
          return {
            ...item,
            quantity: match?.quantity || 0,
          };
        });

        setFoodList(merged);
      }
    };

    fetchFoodList();
  }, [currentOrder]);

  const username = localStorage.getItem("email");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
        console.log("Fetched orders:", response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    if (username) fetchOrders();
  }, [username]);
  const navigate = useNavigate();
  return (
    <div>
      <center>
        <h2>My Orders</h2>
      </center>
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
      <div className="orders-container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="basic-info">
                <p>#{index + 1}</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="status">{order.status}</p>
                <p>{order.quantity}</p>
                <p className="Total">₹ {order.totalPrice} /-</p>
              </div>

              <div
                className={
                  `order-details` +
                  (displayOrderid === order._id ? "-expanded" : "")
                }
              >
                {displayOrderid === order._id && (
                  <div className="order-details-content">
                    <h3>Order Details</h3>
                    <p>{order._id}</p>
                    <p>Items:</p>
                    <ul className="order-items-list">
                      <li>
                        <h4>Quantity</h4>
                        <h4>Details</h4>
                        <h4>Unit price</h4>
                      </li>
                      {foodList.map((item) => (
                        <li key={item._id}>
                          <div>{`${item.quantity}`}</div>
                          <div>
                            <img src={item.imageUrl} />
                            {item.name}
                          </div>
                          {`₹${item.price}/- `}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                className="details-button"
                onClick={() => display(order._id)}
              >
                Details
                <br />
                {displayOrderid !== order._id ? (
                  <i className="ri-arrow-down-wide-line"></i>
                ) : (
                  <i className="ri-arrow-up-wide-fill"></i>
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
