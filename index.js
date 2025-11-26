// index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* ✅ MongoDB connection */
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/kambaz";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ✅ CORS */
const LOCAL_ORIGIN = "http://localhost:3000";
const PROD_ORIGIN = "https://kambaz-next-js-73zh.vercel.app";

app.use(
  cors({
    origin: isProd ? PROD_ORIGIN : LOCAL_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

/* ✅ Required for Render */
if (isProd) {
  app.set("trust proxy", 1);
}

/* ✅ SESSION HANDLING (PRODUCTION SAFE) */
app.use(
  session({
    name: "sid",
    store: MongoStore.create({
      mongoUrl: CONNECTION_STRING,
    }),
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  })
);

/* ✅ ROUTES */
UserRoutes(app);
CourseRoutes(app);
ModulesRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
Lab5(app);
Hello(app);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
