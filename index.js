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

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/Kambaz";

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch(err => console.error(" MongoDB error:", err));

const app = express();


const isProd = process.env.NODE_ENV === "production";


const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://kambaz-next-js-73zh.vercel.app"
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin), false);
  },
  credentials: true
}));

app.use(express.json());

if (isProd) {
  app.set("trust proxy", 1);
}


app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd ? true : false
  }
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

db.users = usersModel;

UserRoutes(app);
CourseRoutes(app);  
ModulesRoutes(app); 
AssignmentRoutes(app); 
EnrollmentRoutes(app);

Lab5(app);
Hello(app);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
