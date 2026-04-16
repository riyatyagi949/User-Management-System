import User from "../models/User.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
    } = req.query;

    const query = {
      isDeleted: false,
      $and: [],
    };

    if (search) {
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (role) {
      query.$and.push({ role });
    }

    if (status) {
      query.$and.push({ status });
    }

    if (query.$and.length === 0) {
      delete query.$and;
    }

    if (req.user.role === "manager") {
      query.role = { $ne: "admin" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    return successResponse(res, 200, "Users fetched successfully", {
      users: users.map((user) => user.toSafeObject()),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role");

    if (!user || user.isDeleted) {
      return errorResponse(res, 404, "User not found");
    }

    if (req.user.role === "manager" && user.role === "admin") {
      return errorResponse(res, 403, "Managers cannot access admin details");
    }

    if (req.user.role === "user" && user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, "You can only access your own profile");
    }

    return successResponse(res, 200, "User fetched successfully", user.toSafeObject());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, "User already exists");
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || "User@123",
      role,
      status,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    return successResponse(res, 201, "User created successfully", user.toSafeObject());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id).select("+password");

    if (!user || user.isDeleted) {
      return errorResponse(res, 404, "User not found");
    }

    if (req.user.role === "manager" && user.role === "admin") {
      return errorResponse(res, 403, "Managers cannot update admin users");
    }

    user.name = name ?? user.name;
    user.email = email ? email.toLowerCase() : user.email;

    if (req.user.role === "admin" && role) {
      user.role = role;
    }

    if (status && (req.user.role === "admin" || req.user.role === "manager")) {
      user.status = status;
    }

    user.updatedBy = req.user._id;

    await user.save();

    return successResponse(res, 200, "User updated successfully", user.toSafeObject());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return errorResponse(res, 404, "User not found");
    }

    if (user.role === "admin") {
      return errorResponse(res, 403, "Admin user cannot be deleted");
    }

    user.isDeleted = true;
    user.status = "inactive";
    user.updatedBy = req.user._id;

    await user.save();

    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user || user.isDeleted) {
      return errorResponse(res, 404, "User not found");
    }

    if (req.user.role === "manager" && user.role === "admin") {
      return errorResponse(res, 403, "Managers cannot change admin status");
    }

    user.status = status;
    user.updatedBy = req.user._id;

    await user.save();

    return successResponse(res, 200, "User status updated successfully", user.toSafeObject());
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};