require("./config/db");
require("./expiredGigsCleanup");
const express = require("express");
const session = require("express-session");
const os = require("os");
const http = require("http");
const socketIo = require("socket.io");
const MongoStore = require("connect-mongo");
const UserRouter = require("./api/User");
const GigRouter = require("./api/Gig");
const Gig = require("./models/Gig");
const GigGuestsRouter = require("./api/GigGuests");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON
app.use(express.json());

// Setup session middleware
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI + "/session_management",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day session expiration
    },
  })
);

// User Routes
app.use("/user", UserRouter);

// Gig Routes with session check middleware
app.use("/api/gigs", GigRouter);

app.use("/api/mapping", GigGuestsRouter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Change Stream to watch changes in the Gig collection
const gigChangeStream = Gig.watch();
gigChangeStream.on("change", (change) => {
  console.log("Gig change detected:", change);
  io.emit("gigUpdated", change);
});

// Setup Socket.IO to listen for client connections
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(port, () => {
  const networkInterfaces = os.networkInterfaces();
  const ip =
    networkInterfaces["en0"]?.find((i) => i.family === "IPv4")?.address ||
    "localhost";
  console.log(`Server running at http://${ip}:${port}`);
});
