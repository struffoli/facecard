import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// CONFIG
console.log("Configuring app...");
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// ROUTES
app.get("/", (req, res) => res.send("Server is ready"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifs", notificationRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/products", productRoutes);
app.use(notFound);
app.use(errorHandler);

// MONGODB
console.log("Connecting to database...");
connectDB();

// SERVER
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}`));
