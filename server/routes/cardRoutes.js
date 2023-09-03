import express from "express";
import {
  createCard,
  addComment,
  addReply,
  addStep,
  getCard,
  getComments,
  getReplies,
  getSteps,
  renameCard,
  editComment,
  editReply,
  updateStep,
  deleteCard,
  deleteComment,
  deleteReply,
  deleteStep,
} from "../controllers/cardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/card", protect, createCard);
router.post("/:id/comment", protect, addComment);
router.post("/:id/:commentId/reply", protect, addReply);
router.post("/:id/step", protect, addStep);

// READ
router.get("/:id", protect, getCard);
router.get("/:id/comments", protect, getComments);
router.get("/:id/:commentId/replies", protect, getReplies);
router.get("/:id/steps", protect, getSteps);

// UPDATE
router.patch("/card/:id", protect, renameCard);
router.patch("/comment/:id", protect, editComment);
router.patch("/reply/:id", protect, editReply);
router.patch("/step/:cardId/:stepId", protect, updateStep);

// DELETE
router.delete("/card/:id", protect, deleteCard);
router.delete("/comment/:id", protect, deleteComment);
router.delete("/reply/:id", protect, deleteReply);
router.delete("/step/:id", protect, deleteStep);

export default router;
