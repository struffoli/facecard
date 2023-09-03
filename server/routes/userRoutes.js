import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../config/fileStorage.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// READ
router.get("/:id/profile", protect, getUser);
router.get("/:id/friends", protect, getUserFriends);

// UPDATE
router.patch("/:id/:friendId", protect, addRemoveFriend);
router.put(
  "/:id/profile",
  protect,
  upload.single("picture"),
  updateUserProfile
);

export default router;
