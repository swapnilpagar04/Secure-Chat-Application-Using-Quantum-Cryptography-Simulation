const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 1) CORS FIRST
app.use(
  cors({
    origin:  "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 2) JSON body parser
app.use(express.json());

// 3) Routes AFTER middleware

// QKD routes
const qkdRoutes = require("./routes/qkd");
app.use("/api/qkd", qkdRoutes);

// Chat routes
const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);

// Auth routes
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));