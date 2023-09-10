import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    linkedObjectId: {
      type: String,
      required: true,
    },
    linksToCard: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
