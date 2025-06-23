import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, foodmetrics);
    console.log("Successful Connection");
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
export default connectDb;
