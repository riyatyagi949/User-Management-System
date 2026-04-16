import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/response.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "Unauthorized: token missing");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.isDeleted) {
      return errorResponse(res, 401, "Unauthorized: user not found");
    }

    if (user.status !== "active") {
      return errorResponse(res, 403, "Account is inactive");
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Unauthorized: invalid token");
  }
};

export default protect;