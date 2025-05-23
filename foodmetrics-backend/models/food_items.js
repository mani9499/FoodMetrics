import mongoose from "mongoose";
const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Food name is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Vegetarian", "Non-Vegetarian", "Vegan", "Dessert", "Beverage"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    default: 0,
    min: [0, "Calories cannot be negative"],
  },
});

const FoodItem = mongoose.model("FoodItem", FoodSchema);

export default FoodItem;
