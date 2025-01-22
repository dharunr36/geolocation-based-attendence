import express  from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

import connecttomongodb from "./db/connecttomongoDB.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;


import cors from 'cors';
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true, // Replace with your frontend URL
  }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);

app.listen(PORT,()=>{
    connecttomongodb()
    console.log(`server running in port ${PORT}`)
});

