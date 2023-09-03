import express from "express";
import {
  createNotification,
  getActiveUserNotifications,
  getUserNotifications,
  clearNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createNotification);

// READ
router.get("/:userId/active", protect, getActiveUserNotifications);
router.get("/:userId", protect, getUserNotifications);

// UPDATE
router.patch("/:id/clear", protect, clearNotification);

export default router;
