import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createPost);

// READ
router.get("/", protect, getFeedPosts);
router.get("/:userId", protect, getUserPosts);

// UPDATE
router.patch("/:id/like", protect, likePost);

// DELTE
router.delete("/:id", protect, deletePost);

export default router;
