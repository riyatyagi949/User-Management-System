import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany({});

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
      status: "active",
    });

    const manager = await User.create({
      name: "Manager User",
      email: "manager@example.com",
      password: "Manager@123",
      role: "manager",
      status: "active",
      createdBy: admin._id,
      updatedBy: admin._id,
    });

    await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "User@123",
      role: "user",
      status: "active",
      createdBy: admin._id,
      updatedBy: manager._id,
    });

    console.log("Seeded users successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedUsers();