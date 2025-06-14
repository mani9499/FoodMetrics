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

function getYear(dateStr) {
  return new Date(dateStr).getFullYear();
}

function Yearly() {
  const username = localStorage.getItem("email");
  const [yearlyCalories, setYearlyCalories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYearlyCalories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );
        const orders = response.data;

        const yearMap = {};

        for (const order of orders) {
          const year = getYear(order.createdAt);
          if (!yearMap[year]) yearMap[year] = [];
          yearMap[year].push(order._id);
        }

        const calorieRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/calories-by-month`, // You can reuse the same endpoint
          { orderIdsByMonth: yearMap }
        );

        console.log("Yearly Calorie Data:", calorieRes.data);
        setYearlyCalories(calorieRes.data);
      } catch (error) {
        console.error("Error fetching yearly calories", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchYearlyCalories();
  }, [username]);

  if (!username) return <p>Please log in to view your yearly summary.</p>;
  if (loading) return <p>Loading yearly data...</p>;

  const chartData = Object.entries(yearlyCalories)
    .sort((a, b) => a[0] - b[0]) // sort by year
    .map(([year, calories]) => ({ year, calories }));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Yearly Calorie Summary</h2>
      {chartData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#12ca1f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Yearly;
