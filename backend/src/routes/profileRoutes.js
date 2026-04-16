import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", protect, getMyProfile);
router.patch("/", protect, updateMyProfile);
router.patch("/password", protect, updateMyPassword);

export default router;