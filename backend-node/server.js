const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const { initializePool, getDBConnection } = require("./db");
const {
  ALLOWED_ORIGINS,
  JWT_SECRET,
  JWT_ISSUER,
  JWT_AUD,
  JAVA_BACKEND_URL,
  PORT,
  SESSION_SECRET,
} = require("./config");

// Import all routes
const myVotes = require("./routes/myVotes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userprofileRoutes");
const createdElections = require("./routes/createdElections");
const loginRoutes = require("./routes/loginRoutes");
const personalprofileRoutes = require("./routes/personalprofileRoutes");
const electionForm = require("./routes/electionForm");
const collegeinfoRoutes = require("./routes/collegeinfoRoutes");
const electionFormTable = require("./routes/electionFormTable");
const welcomeRoutes = require("./routes/welcomeRoutes");
const votePage = require("./routes/votePage");
const messageDetails = require("./routes/messageDetails");
const message = require("./routes/message");
const electionRoutes = require("./routes/electionRoutes");
const results = require("./routes/results");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    methods: ["GET", "POST"],
  },
});

// 🔧 Set io in app for global access
app.set("io", io);

app.set("trust proxy", 1);

// ✅ Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: { policy: "no-referrer" },
  })
);

// ✅ Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ✅ Middleware setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ strict: true, limit: "10kb", type: "application/json" }));
app.use(express.urlencoded({ extended: false, limit: "10kb", parameterLimit: 1000 }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    },
  })
);

// ✅ WebSocket logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// ✅ Route setup
app.use("/api", userRoutes);
app.use("/api", userProfileRoutes);
app.use("/api", loginRoutes);
app.use("/api", personalprofileRoutes);
app.use("/api", collegeinfoRoutes);
app.use("/api", electionForm);
app.use("/api", electionFormTable);
app.use("/api", votePage);
app.use("/api", electionRoutes);
app.use("/api", message);
app.use("/api", messageDetails);
app.use("/api", welcomeRoutes);
app.use("/api", results);
app.use("/api", myVotes);
app.use("/api", createdElections);

// ✅ 404 & Error handling
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not Found" });
});
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({ error: err.message });
});

async function startServer() {
  try {
    const dbReady = await initializePool();
    if (dbReady) {
      await getDBConnection();
      console.log("✅ DB Connected!");
    } else {
      console.warn("⚠️ Database features are unavailable; API will run in degraded mode.");
    }

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    console.warn("⚠️ Continuing in degraded mode without a working database connection.");
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  }
}

startServer();

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  process.exit(0);
});
