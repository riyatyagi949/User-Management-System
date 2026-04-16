import { validationResult } from "express-validator";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    }).select("+password");

    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    if (user.status !== "active") {
      return errorResponse(res, 403, "Your account is inactive");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    return successResponse(res, 200, "Login successful", {
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getCurrentUser = async (req, res) => {
  return successResponse(res, 200, "Current user fetched successfully", req.user.toSafeObject());
};

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "Validation failed", errors.array());
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, "User already exists");
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user",
      status: "active",
    });

    return successResponse(res, 201, "Registration successful", {
      user: user.toSafeObject(),
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};