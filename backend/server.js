import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import connecttomongodb from "./db/connecttomongoDB.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const NODE_ENV = process.env.NODE_ENV || "development";

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://geolocation-based-attendence-l7qj-91fv9lpxx.vercel.app/",
  "https://geoattend-iq4uwj4ok-dharuns-projects-7c3d278a.vercel.app/" // Add more origins if necessary
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middleware
app.use(morgan(NODE_ENV === "development" ? "dev" : "combined")); // Detailed logs in development, concise in production
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB and Start Server
connecttomongodb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if the database connection fails
  });
