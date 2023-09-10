import { Card, Comment, Reply, Step } from "../models/cardModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create a card
// @route   POST /api/cards/card
// @access  Private
const createCard = asyncHandler(async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const newCard = new Card({
      userId,
      name,
      comments: [],
      steps: [],
    });
    await newCard.save();

    const cards = await Card.find({ userId });
    res.status(201).json(cards);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Add a comment to a card
// @route   POST /api/cards/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, description } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const user = await User.findById(userId);
    const card = await Card.findById(id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (!card) {
      res.status(404);
      throw new Error("Card not found");
    }

    const newComment = new Comment({
      userId,
      description,
      replies: [],
    });
    await newComment.save();

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { comments: [...card.comments, newComment._id] },
      { new: true }
    );

    res.status(201).json(updatedCard.comments);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Add a reply to a comment
// @route   POST /api/cards/:id/:commentId/reply
// @access  Private
const addReply = asyncHandler(async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userId, description } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const user = await User.findById(userId);
    const card = await Card.findById(id);
    const comment = await Comment.findById(commentId);

    if (!card) {
      res.status(404);
      throw new Error("Card not found");
    }
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }

    const newReply = new Reply({
      userId,
      description,
    });
    await newReply.save();

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { replies: [...comment.replies, newReply._id] },
      { new: true }
    );
    await card.save();

    res.status(201).json(updatedComment.replies);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Add a step to a card
// @route   POST /api/cards/:id/step
// @access  Private
const addStep = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId, isAM, isPM, frequency } = req.body;
    const card = await Card.findById(id);

    if (!card) {
      res.status(404);
      throw new Error("Card not found");
    }

    if (card.userId !== String(req.user._id) || card.userId !== userId) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const product = await Product.findById(productId);
    const newStep = new Step({
      productId,
      productType: product.productType,
      productName: product.productName,
      isLiked: product.likes.get(userId) || false,
      isHolyGrail: product.holyGrails.get(userId) || false,
      isAM,
      isPM,
      frequency,
    });
    await newStep.save();

    const newCard = await Card.findByIdAndUpdate(
      id,
      { steps: [...card.steps, newStep._id] },
      { new: true }
    );

    res.status(201).json(newCard.steps);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Get a card
// @route   GET /api/cards/:id
// @access  Private
const getCard = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      throw new Error("Card not found");
    }

    res.status(200).json(card);
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
});

// @desc    Get comments on a post
// @route   GET /api/cards/:id/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      throw new Error("Card not found");
    }

    const comments = await Promise.all(
      card.comments.map((id) => Comment.findById(id))
    );

    res.status(200).json(comments);
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
});

// @desc    Get replies to a comment
// @route   GET /api/cards/:id/:commentId/replies
// @access  Private
const getReplies = asyncHandler(async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const card = await Card.findById(id);
    const comment = await Comment.findById(commentId);
    if (!card) {
      throw new Error("Card not found");
    }
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (!card.comments.includes(comment._id)) {
      res.status(409);
      throw new Error("Invalid comment");
    }

    const replies = await Promise.all(
      comment.replies.map((id) => Reply.findById(id))
    );

    res.status(200).json(replies);
  } catch (err) {
    if (res.statusCode !== 409) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Get steps for a card
// @route   GET /api/cards/:id/steps
// @access  Private
const getSteps = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      throw new Error("Card not found");
    }

    const steps = await Promise.all(card.steps.map((id) => Step.findById(id)));

    res.status(200).json(steps);
  } catch (err) {
    res.status(404);

    throw new Error(err);
  }
});

// @desc    Rename a card
// @route   PATCH /api/cards/card/:id
// @access  Private
const renameCard = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      throw new Error("Card not found");
    }
    if (card.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    card.name = req.body.name || card.name;

    const updatedCard = await card.save();

    res.status(200).json(updatedCard);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Edit a comment
// @route   PATCH /api/cards/comment/:id
// @access  Private
const editComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    comment.description = req.body.description || card.description;

    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Edit a reply
// @route   PATCH /api/cards/reply/:id
// @access  Private
const editReply = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const reply = await Reply.findById(id);

    if (!reply) {
      res.status(404);
      throw new Error("Reply not found");
    }
    if (reply.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    reply.description = req.body.description || reply.description;

    const updatedReply = await reply.save();

    res.status(200).json(updatedReply);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Edit a step
// @route   PATCH /api/cards/step/:cardId/:stepId
// @access  Private
const updateStep = asyncHandler(async (req, res) => {
  try {
    const { cardId, stepId } = req.params;
    const card = await Card.findById(cardId);
    const step = await Step.findById(stepId);

    if (!card) {
      throw new Error("Card not found");
    }
    if (!step) {
      throw new Error("Step not found");
    }
    if (!card.steps.includes(step._id)) {
      throw new Error("Invalid step");
    }

    if (card.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    if (req.body.productId) {
      const product = await Product.findById(req.body.productId);
      step.productId = req.body.productId;
      step.productType = product.productType;
      step.productName = product.productName;
      step.isLiked = product.likes.get(step.userId) || false;
      step.isHolyGrail = product.holyGrails.get(step.userId) || false;
    }
    step.isAM = req.body.isAM || step.isAM;
    step.isPM = req.body.isPM || step.isPM;

    const updatedStep = await step.save();

    await res.status(200).json(updatedStep);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a card
// @route   DELETE /api/cards/card/:id
// @access  Private
const deleteCard = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validateCard = await Card.findById(id);
    if (!validateCard) {
      throw new Error("Card not found");
    }
    if (validateCard.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const card = await Card.findByIdAndDelete(id);
    res.status(200).json(card);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a comment
// @route   DELETE /api/cards/comment/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validateComment = await Comment.findById(id);
    if (!validateComment) {
      throw new Error("Comment not found");
    }
    if (validateComment.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const comment = await Comment.findByIdAndDelete(id);
    res.status(200).json(comment);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a reply
// @route   DELETE /api/cards/reply/:id
// @access  Private
const deleteReply = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validateReply = await Reply.findById(id);
    if (!validateReply) {
      throw new Error("Reply not found");
    }
    if (validateReply.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const reply = await Reply.findByIdAndDelete(id);
    res.status(200).json(reply);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a step
// @route   DELETE /api/cards/step/:id
// @access  Private
const deleteStep = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validateStep = await Step.findById(id);
    if (!validateStep) {
      throw new Error("Step not found");
    }
    if (validateStep.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const step = await Step.findByIdAndDelete(id);
    res.status(200).json(step);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

export {
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
};
