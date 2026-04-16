import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getMyProfile = async (req, res) => {
  return successResponse(res, 200, "Profile fetched successfully", req.user.toSafeObject());
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (name) user.name = name;
    user.updatedBy = req.user._id;

    await user.save();

    return successResponse(res, 200, "Profile updated successfully", user.toSafeObject());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 400, "Current password is incorrect");
    }

    user.password = newPassword;
    user.updatedBy = req.user._id;

    await user.save();

    return successResponse(res, 200, "Password updated successfully");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};