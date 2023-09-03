import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/userModel.js";

// @desc    Get a user's profile
// @route   GET /api/users/:id/profile
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// @desc    Get a user's friends
// @route   GET /api/users/:id/friends
// @access  Private
const getUserFriends = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, fullName, username, picturePath }) => {
        return { _id, fullName, username, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Add/remove a user from the user's friends list
// @route   PATCH /api/users/:id/:friendId
// @access  Private
const addRemoveFriend = asyncHandler(async (req, res) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    res.status(404);
    throw new Error("User(s) not found");
  }

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((curId) => curId !== friendId);
    friend.friends = friend.friends.filter((curId) => curId !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedFriends = friends.map(
    ({ _id, fullName, username, picturePath }) => {
      return { _id, fullName, username, picturePath };
    }
  );

  res.status(200).json(formattedFriends);
});

// @desc    Update user profile
// @route   PUT /api/users/:id/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id !== String(req.user._id)) {
    res.status(401);
    throw new Error("Unauthorized user");
  }

  const user = await User.findById(id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.username = req.body.username || user.username;
    user.usernameLower = req.body.username || user.usernameLower;
    user.usernameLower = user.usernameLower.toLowerCase();
    user.email = req.body.email || user.email;
    user.email = user.email.toLowerCase();
    user.picturePath = req.body.picturePath || user.picturePath;
    user.activeCardId = req.body.activeCardId || user.activeCardId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      username: updatedUser.username,
      email: updatedUser.email,
      picturePath: updatedUser.picturePath,
      activeCardId: updatedUser.activeCardId,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

export { getUser, getUserFriends, updateUserProfile, addRemoveFriend };
