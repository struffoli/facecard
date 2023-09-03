import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  try {
    const { userId, linkedObjectId, linksToCard, description } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const newPost = new Post({
      userId,
      userUsername: user.username,
      linkedObjectId,
      linksToCard,
      description,
      userPicturePath: user.picturePath,
      likes: {},
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(409);
    }
    throw new Error(err);
  }
});

// @desc    Get posts for a user's feed
// @route   GET /api/posts
// @access  Private
const getFeedPosts = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const posts = await Post.find({
      userId: { $in: [...user.friends, user._id] },
    });
    res.status(200).json(posts);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Get posts for a user
// @route   GET /api/posts/:userId
// @access  Private
const getUserPosts = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (
      userId !== String(req.user._id) &&
      !user.isPublic &&
      !user.friends.includes(String(req.user._id))
    ) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Toggle the liked status of a post
// @route   PATCH /api/posts/:id/like
// @access  Private
const likePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validatePost = await Post.findById(id);
    if (validatePost.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const post = await Post.findByIdAndDelete(id);
    res.status(200).json(post);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

export { createPost, getFeedPosts, getUserPosts, likePost, deletePost };
