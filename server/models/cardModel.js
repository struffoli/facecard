import mongoose from "mongoose";

const replySchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userUsername: {
      type: String,
      required: true,
    },
    userPicturePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 1,
      max: 200,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userUsername: {
      type: String,
      required: true,
    },
    userPicturePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      min: 1,
      max: 200,
    },
    replies: {
      type: Array,
      required: true,
      default: [],
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const stepSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      min: 1,
      max: 40,
    },
    productName: {
      type: String,
      required: true,
      min: 1,
      max: 60,
    },
    isLiked: {
      type: Boolean,
      required: true,
      default: false,
    },
    isHolyGrail: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAM: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPM: {
      type: Boolean,
      required: true,
      default: false,
    },
    frequency: {
      type: Number,
      required: true,
      default: 7,
      min: 0,
      max: 8,
    },
  },
  {
    timestamps: true,
  }
);

const cardSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userUsername: {
      type: String,
      required: true,
    },
    userPicturePath: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
      default: [],
    },
    steps: {
      type: Array,
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.pre("save", async function (next) {
  if (this.isModified("description")) {
    this.edited = true;
  }
});

replySchema.pre("save", async function (next) {
  if (this.isModified("description")) {
    this.edited = true;
  }
});

const Card = mongoose.model("Card", cardSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Reply = mongoose.model("Reply", replySchema);
const Step = mongoose.model("Step", stepSchema);

export { Card, Comment, Reply, Step };
