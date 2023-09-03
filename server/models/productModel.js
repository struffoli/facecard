import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    picturePath: {
      type: String,
      required: true,
      default: "test",
    },
    ingredients: {
      type: Array,
      of: String,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    holyGrails: {
      type: Map,
      of: Boolean,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
