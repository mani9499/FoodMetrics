import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function getMonthYear(dateStr) {
  const date = new Date(dateStr);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${year} ${month}`;
}

function Monthly() {
  const username = localStorage.getItem("email");
  const [monthlyCalories, setMonthlyCalories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyCalories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );
        const orders = response.data;

        const monthMap = {};

        for (const order of orders) {
          const month = getMonthYear(order.createdAt);
          if (!monthMap[month]) monthMap[month] = [];
          monthMap[month].push(order._id);
        }

        const calorieRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/calories-by-month`,
          { orderIdsByMonth: monthMap }
        );

        console.log("Monthly Calorie Data:", calorieRes.data); // ✅ log here
        setMonthlyCalories(calorieRes.data);
      } catch (error) {
        console.error("Error fetching monthly calories", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchMonthlyCalories();
  }, [username]);

  if (!username) return <p>Please log in to view your monthly summary.</p>;
  if (loading) return <p>Loading monthly data...</p>;

  const chartData = Object.entries(monthlyCalories)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([month, calories]) => ({ month, calories }));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Monthly Calorie Summary</h2>
      {chartData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#aafa11" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Monthly;
