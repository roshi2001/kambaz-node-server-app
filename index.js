import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
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

const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://127.0.0.1:27017/Kambaz";

mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const app = express();


app.set("trust proxy", 1);


app.use(cors({
  origin: "https://kambaz-next-js-73zh.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
  name: "sid",
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    touchAfter: 24 * 3600,
    crypto: {
      secret: process.env.SESSION_SECRET || "kambaz"
    }
  }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    user: req.session?.currentUser?._id
  });
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


app.get("/api/health", (_req, res) => res.json({ 
  ok: true, 
  env: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
}));


app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend: https://kambaz-next-js-73zh.vercel.app`);
});
