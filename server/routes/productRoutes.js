import express from "express";
import {
  createProduct,
  getProduct,
  getUserLikedProducts,
  getUserHolyGrailedProducts,
  updateProduct,
  likeProduct,
  holyGrailProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { upload } from "../config/fileStorage.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, createProduct);

// READ
router.get("/:id", protect, getProduct);
router.get("/:userId/likes", protect, getUserLikedProducts);
router.get("/:userId/holyGrails", protect, getUserHolyGrailedProducts);

// UPDATE
router.patch("/:id", protect, upload.single("picture"), updateProduct);
router.patch("/:id/like", protect, likeProduct);
router.patch("/:id/holyGrail", protect, holyGrailProduct);

// DELETE
router.delete("/:id", protect, deleteProduct);

export default router;
