import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User";
import * as dotenv from 'dotenv';
dotenv.config();

async function createAdminClient() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/");
    console.log("Connected to DB");
    
    const email = "admin@example.com";
    const password = "password123";
    
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("User already exists!");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "Admin User",
      email,
      password: hashedPassword,
    });

    console.log("Client account created successfully for admin@example.com!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdminClient();
