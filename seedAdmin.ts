import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

mongoose.connect(process.env.MONGO_URI as string).then(async () => {
  try {
    const email = "admin@hrms.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Delete existing admin to clear any wrong hashes
    await User.deleteOne({ email });
    
    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });
    console.log("Admin account successfully reset to admin@hrms.com / admin123!");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    process.exit(0);
  }
});
