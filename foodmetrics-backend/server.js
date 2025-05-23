import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/connectDb.js";
import FoodItem from "./models/food_items.js";
import users from "./models/users.js";
import Order from "./models/orders.js";
const app = express();
app.use(cors());
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
app.listen(port, () => {
  console.log(`Server running successfully at http://localhost:${port}`);
});
