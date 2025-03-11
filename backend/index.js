require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const chatRoutes = require("./routes/chatRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes); // it tells the backend to handle this request
app.use("/api/skills", skillRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/bookings", bookingRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
  
// Routes
app.get("/", (req, res) => {
  res.send("Skill Barter Marketplace API Running");
});

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST", "PUT"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", ({ chatId, text, sender }) => {
    io.to(chatId).emit("newMessage", { sender, text });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("io", io); // Make io accessible in routes


// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // why app is converted to server
