import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import mongoose from "mongoose";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";

import db from "./Kambaz/Database/index.js";
import usersModel from "./Kambaz/Users/model.js";

// ✅ Mongo connection
const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// ✅ FORCE production for Render
const isProd = true;

// ✅ Allow Vercel frontend
const ALLOWED_ORIGINS = [
  "https://kambaz-next-js-zj63.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin), false);
  },
  credentials: true,
}));

app.use(express.json());
app.set("trust proxy", 1);

// ✅ SESSION FIX (THIS IS THE KEY)
app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true
  }
}));

db.users = usersModel;

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
Lab5(app);
Hello(app);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
