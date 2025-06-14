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

function getMonthWeek(dateStr) {
  const date = new Date(dateStr);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const day = date.getDate();

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = firstDayOfMonth.getDay();

  const weekInMonth = Math.ceil((day + offset) / 7);

  return `${year} ${month} - Week ${weekInMonth}`;
}

function Weekly() {
  const username = localStorage.getItem("email");
  const [weeklyCalories, setWeeklyCalories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyCalories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${username}`
        );
        const orders = response.data;

        const weekMap = {};

        for (const order of orders) {
          const week = getMonthWeek(order.createdAt);
          if (!weekMap[week]) weekMap[week] = { orders: [] };
          weekMap[week].orders.push(order);
        }

        const orderIdsByWeek = {};
        for (const week in weekMap) {
          orderIdsByWeek[week] = weekMap[week].orders.map((o) => o._id);
        }

        const calorieRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/calories-by-week`,
          { orderIdsByWeek }
        );

        setWeeklyCalories(calorieRes.data);
      } catch (error) {
        console.error("Error fetching weekly calories", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchWeeklyCalories();
  }, [username]);

  if (!username) return <p>Please log in to view your weekly summary.</p>;
  if (loading) return <p>Loading weekly data...</p>;

  const chartData = Object.entries(weeklyCalories)
    .map(([week, calories]) => ({ week, calories: calories ?? 0 }))
    .sort((a, b) => {
      const parse = (str) => {
        const [year, rest] = str.split(" ");
        const [monthName, weekStr] = rest.split(" - Week ");
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        return {
          year: parseInt(year),
          month: monthIndex,
          week: parseInt(weekStr),
        };
      };

      const aData = parse(a.week);
      const bData = parse(b.week);

      if (aData.year !== bData.year) return aData.year - bData.year;
      if (aData.month !== bData.month) return aData.month - bData.month;
      return aData.week - bData.week;
    });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Weekly Calorie Summary</h2>
      {chartData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#f37724" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default Weekly;
