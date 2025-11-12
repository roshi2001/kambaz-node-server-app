import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";

import db from "./Kambaz/Database/index.js";

const app = express();


const isProd = process.env.NODE_ENV === "production"; // CHANGED


const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
const ALLOWED_ORIGINS = [
  CLIENT_URL,
  "https://kambaz-next-js-33t1.vercel.app", 
  "http://localhost:3000",                    
];


app.use(
  cors({
    origin(origin, cb) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked for origin: " + origin), false);
    },
    credentials: true,
  })
);


app.options(
  "*",
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);


app.use(express.json()); 


if (isProd) app.set("trust proxy", 1); 


const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                      
    sameSite: isProd ? "none" : "lax",    
    secure:   isProd ? true   : false,    
  },
};

app.use(session(sessionOptions));

UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
Lab5(app);
Hello(app);

app.get("/api/health", (_req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
