import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js';
import messageRoute from './routes/message.js';
import cors from 'cors';
import { app, server } from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

// Basic route for testing
app.get('/', (_, res) => {
    return res.status(200).json({
        message: "backend",
        success: true,
    });
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// CORS settings (adjust origin if needed)
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend origin
    credentials: true,  // Allow credentials (cookies, authentication headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Start server and connect to the database
server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server listening at port ${PORT}`);
    } catch (err) {
        console.error("Database connection failed", err);
    }
});
