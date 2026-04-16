import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { allowRoles } from "../middlewares/rbacMiddleware.js";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, allowRoles("admin", "manager"), getUsers);
router.get("/:id", protect, getUserById);
router.post("/", protect, allowRoles("admin"), createUser);
router.patch("/:id", protect, allowRoles("admin", "manager"), updateUser);
router.patch("/:id/status", protect, allowRoles("admin", "manager"), updateUserStatus);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;