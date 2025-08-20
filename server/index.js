const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require('express-rate-limit');
const path = require("path");

const authRoutes = require("./routes/auth");
const dataRoutes = require("./routes/data");
const adminRoutes = require("./routes/admin");

const app = express();
const server = http.createServer(app);

// Configure CORS origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.CLIENT_URL
    ].filter(Boolean); // Remove any undefined values
    
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// ... rest of your code remains the same
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use('/api/admin', adminLimiter, adminRoutes);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  
  socket.on("join-admin", (userData) => {
    if (userData && userData.role === "admin") {
      socket.join("admin-room");
      console.log(`Admin user ${userData.id} joined admin room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.set("io", io);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client" , "build" , "index.html"));
  });
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    server.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port", process.env.PORT || 5000)
    );
  })
  .catch(err => console.error("MongoDB Error:", err));