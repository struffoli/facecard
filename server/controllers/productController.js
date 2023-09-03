import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler";

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { userId, productType, productName, ingredients, description } =
      req.body;

    const newProduct = new Product({
      userId,
      productType,
      productName,
      ingredients: ingredients.split(", "),
      description,
      likes: {},
      holyGrails: {},
    });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(409);
    throw new Error(err);
  }
});

// @desc    Get a product
// @route   GET /api/products/:id
// @access  Private
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
});

// @desc    Get a user's liked products
// @route   GET /api/products/:userId/likes
// @access  Private
const getUserLikedProducts = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find();
    const filteredProducts = products.filter(({ likes }) => {
      return likes.get(userId);
    });

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
});

// @desc    Get a user's holy grailed products
// @route   GET /api/products/:userId/holyGrails
// @access  Private
const getUserHolyGrailedProducts = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find();
    const filteredProducts = products.filter(({ holyGrails }) => {
      return holyGrails.get(userId);
    });

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(404);
    throw new Error(err);
  }
});

// @desc    Edit a product
// @route   PATCH /api/products/:id
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    product.productType = req.body.productType || product.productType;
    product.productName = req.body.productName || product.productName;
    product.ingredients = req.body.ingredients || product.ingredients;
    product.description = req.body.description || product.description;
    product.picturePath = req.body.picturePath || product.picturePath;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Toggle the liked status of a product
// @route   PATCH /api/products/:id/like
// @access  Private
const likeProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const isLiked = product.likes.get(userId);

    if (isLiked) {
      product.likes.delete(userId);
    } else {
      product.likes.set(userId, true);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { likes: product.likes },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Toggle the holy grail status of a product
// @route   PATCH /api/products/:id/like
// @access  Private
const holyGrailProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    const isHolyGrail = product.holyGrails.get(userId);

    if (isHolyGrail) {
      product.holyGrails.delete(userId);
    } else {
      product.holyGrails.set(userId, true);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { holyGrails: product.holyGrails },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const validateProduct = await Product.findById(id);
    if (!validateProduct) {
      throw new Error("Product not found");
    }
    if (validateProduct.userId !== String(req.user._id)) {
      res.status(401);
      throw new Error("Unauthorized user");
    }

    const product = await Product.findByIdAndDelete(id);
    res.status(200).json(product);
  } catch (err) {
    if (res.statusCode !== 401) {
      res.status(404);
    }
    throw new Error(err);
  }
});

export {
  createProduct,
  getProduct,
  getUserLikedProducts,
  getUserHolyGrailedProducts,
  updateProduct,
  likeProduct,
  holyGrailProduct,
  deleteProduct,
};
