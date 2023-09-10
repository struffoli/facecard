import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 1,
      max: 50,
    },
    username: {
      type: String,
      required: true,
      min: 4,
      max: 30,
      unique: true,
    },
    usernameLower: {
      type: String,
      required: true,
      min: 4,
      max: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 4,
      max: 64,
    },
    picturePath: {
      type: String,
      required: true,
      default: "defaultProfilePicture.jpeg",
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: false,
    },
    friends: {
      type: Array,
      required: true,
      default: [],
    },
    activeCardId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
