import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create notification
// @route   POST /api/notifs
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
  try {
    const { userId, faceCardId, otherUserId, description } = req.body;

    if (otherUserId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      res.status(404);
      throw new Error("User not found");
    }

    const newNotif = new Notification({
      userId,
      faceCardId,
      otherUserId,
      description:
        description.length > 40 ? description.substring(0, 40) : description,
      isActive: true,
    });
    await newNotif.save();

    const notif = await Notification.find();
    res.status(201).json(notif);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Get active notifications for a user
// @route   GET /api/notifs/:userId/active
// @access  Private
const getActiveUserNotifications = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const notifs = await Notification.find({ userId, isActive: true });
    res.status(200).json(notifs);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Get all notifications for a user
// @route   GET /api/notifs/:userId
// @access  Private
const getUserNotifications = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const notifs = await Notification.find({ userId });
    res.status(200).json(notifs);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Set a notification as inactive
// @route   PATCH /api/notifs/:id/clear
// @access  Private
const clearNotification = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);

    if (notif.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    notif.isActive = false;

    const updatedNotif = await Notification.findByIdAndUpdate(
      id,
      { isActive: notif.isActive },
      { new: true }
    );

    res.status(200).json(updatedNotif);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

export {
  createNotification,
  getActiveUserNotifications,
  getUserNotifications,
  clearNotification,
};
