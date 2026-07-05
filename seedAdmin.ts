import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

mongoose.connect(process.env.MONGO_URI as string).then(async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const existing = await User.findOne({ email: "admin@hrms.com" });
    
    if (existing) {
       console.log("Admin account already exists!");
    } else {
       await User.create({
         name: "System Admin",
         email: "admin@hrms.com",
         password: hashedPassword,
         role: "admin"
       });
       console.log("Admin account created successfully!");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    process.exit(0);
  }
});
