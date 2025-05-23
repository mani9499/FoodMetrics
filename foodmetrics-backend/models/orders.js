import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    foodItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      min: [0, "Total amount cannot be negative"],
    },
    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
