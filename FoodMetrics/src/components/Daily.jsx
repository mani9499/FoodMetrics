import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Daily() {
  const username = localStorage.getItem("email");
  const [orders, setOrders] = useState([]);
  const [caloriesByDate, setCaloriesByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );

        const allOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const ordersByDate = {};

        for (const order of allOrders) {
          const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
          if (!ordersByDate[dateKey]) {
            ordersByDate[dateKey] = [];
          }
          ordersByDate[dateKey].push(order);
        }

        const latest7Dates = Object.keys(ordersByDate)
          .sort((a, b) => new Date(b) - new Date(a))
          .slice(0, 7);

        const filteredOrders = latest7Dates.flatMap(
          (date) => ordersByDate[date]
        );
        setOrders(filteredOrders);

        const orderIdsByDate = {};
        for (const date of latest7Dates) {
          orderIdsByDate[date] = ordersByDate[date].map((order) => order._id);
        }

        const caloriesResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/calories-by-date`,
          { orderIdsByDate }
        );

        setCaloriesByDate(caloriesResponse.data);
        console.log("Calories by date:", caloriesResponse.data);
      } catch (error) {
        console.error("Failed to fetch orders or calories", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchOrders();
  }, [username]);

  if (!username) return <p>Please log in to view your daily summary.</p>;
  if (loading) return <p>Loading daily calorie summary...</p>;

  const chartData = Object.entries(caloriesByDate)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, calories]) => ({
      date,
      calories,
    }));

  return (
    <div style={{ padding: "20px" }} className="Summary">
      <h2>Daily Orders Summary</h2>

      {chartData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#9330ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Daily;
