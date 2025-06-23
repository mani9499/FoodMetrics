import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/connectDb.js";
import FoodItem from "./models/food_items.js";
import users from "./models/users.js";
import Order from "./models/orders.js";
import mongoose from "mongoose";
const app = express();
app.use(
  cors({
    origin: "https://food-metrics-a3fsh7zgq-mani9499s-projects.vercel.app",
    credentials: true,
  })
);

dotenv.config();
app.use(express.json());
connectDb();
const port = process.env.PORT || 5000;
app.post("/food_items", async (req, res) => {
  const { food_name, category, price, imageUrl, calories } = req.body;
  try {
    const new_item = new FoodItem({
      name: food_name,
      category,
      price,
      imageUrl,
      calories,
    });
    await new_item.save();
    res.status(201).json({ message: "new item added successfully", new_item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed in adding item", error: error.message });
  }
});

app.get("/food_items", async (req, res) => {
  try {
    const food_itemsList = await FoodItem.find();
    res.status(201).json(food_itemsList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching", error: error.message });
  }
});

app.post("/foods", async (req, res) => {
  const { ids } = req.body;
  console.log("Received IDs:", ids);

  try {
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
    const foodItems = await FoodItem.find({ _id: { $in: objectIds } });
    res.status(200).json(foodItems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching food items",
      error: error.message,
    });
  }
});
app.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const new_user = new users({ name, email, password, phone });
    console.log(name, email, password, phone);
    await new_user.save();
    res.status(201).json({ message: "new user added successfully", new_user });
  } catch (error) {
    console.error("Error occurred:", error);
    res
      .status(500)
      .json({ message: "failed in adding user", error: error.message });
  }
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await users.findOne({ email: username, password });
    if (!user) {
      return res.status(401).json({ message: "No user found" });
    }
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in login", error: error.message });
  }
});

app.post("/orders", async (req, res) => {
  const { foodItems, username, totalPrice, quantity } = req.body;
  const orderTime = new Date();
  try {
    const order = new Order({
      foodItems,
      username,
      totalPrice,
      quantity,
      orderTime,
    });
    await order.save();
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
});
app.get("/orders/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const orders = await Order.find({ username: username });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error in fetching orders", error: error.message });
  }
});
app.post("/calories-by-date", async (req, res) => {
  const orderIdsByDate = req.body.orderIdsByDate;

  try {
    const result = {};

    for (const [date, orderIds] of Object.entries(orderIdsByDate)) {
      const objectIds = orderIds.map((id) => new mongoose.Types.ObjectId(id));

      const orders = await Order.find({ _id: { $in: objectIds } });

      let totalCalories = 0;

      for (const order of orders) {
        for (const item of order.foodItems) {
          const food = await FoodItem.findById(item.foodId);
          if (food) {
            totalCalories += food.calories * item.quantity;
          }
        }
      }

      result[date] = totalCalories;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating calories:", error);
    res.status(500).json({
      message: "Error calculating calories",
      error: error.message,
    });
  }
});
// POST /calories-by-week
app.post("/calories-by-week", async (req, res) => {
  const { orderIdsByWeek } = req.body;
  try {
    const result = {};

    for (const week in orderIdsByWeek) {
      const orderIds = orderIdsByWeek[week];
      const orders = await Order.find({ _id: { $in: orderIds } });
      const foodIds = orders.flatMap((o) =>
        o.foodItems.map((f) => f.foodId.toString())
      );
      const foods = await FoodItem.find({ _id: { $in: foodIds } });

      const foodMap = {};
      foods.forEach((f) => {
        foodMap[f._id.toString()] = f.calories;
      });

      let total = 0;
      orders.forEach((order) => {
        order.foodItems.forEach((f) => {
          total += (foodMap[f.foodId.toString()] || 0) * f.quantity;
        });
      });

      result[week] = total;
    }

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to calculate calories", error: error.message });
  }
});
app.post("/calories-by-month", async (req, res) => {
  const { orderIdsByMonth } = req.body;

  const result = {};
  try {
    for (const month in orderIdsByMonth) {
      const orders = await Order.find({
        _id: { $in: orderIdsByMonth[month] },
      }).populate("foodItems.foodId");

      let totalCalories = 0;
      for (const order of orders) {
        for (const item of order.foodItems) {
          const calories = item.foodId?.calories || 0;
          const quantity = item.quantity || 1;

          if (typeof calories !== "number") {
            console.warn("Missing or invalid calories for item:", item);
          }

          totalCalories += calories * quantity;
        }
      }

      result[month] = totalCalories;
    }

    console.log("Calories sent to client:", result); // ✅ log here

    res.status(200).json(result);
  } catch (error) {
    console.error("Server error:", error); // optional additional log
    res.status(500).json({
      message: "Error calculating monthly calories",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running successfully at http://localhost:${port}`);
});
