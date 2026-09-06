const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from server/.env
dotenv.config({
  path: path.join(__dirname, "../.env")
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Interview Scheduler API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "smart-interview-scheduler-api",
    status: "healthy"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});