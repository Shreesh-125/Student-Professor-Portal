import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import administrationRoute from "./route/Administration.route.js";
import professorRoute from "./route/Professor.route.js";
import studentRoute from "./route/Student.route.js";
import cookieParser from "cookie-parser";
import { logout } from "./controllers/Professor.controller.js";
import path from "path";
import passport from "passport";
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import session from 'express-session';
import { Administration } from "./models/Administration.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Student } from "./models/student.model.js";

dotenv.config({});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ extended: true, limit: "300mb" }));
app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));



// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set true if using HTTPS
  })
);

// Initialize Passport session
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  'administration-microsoft',
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/administration/auth/callback`,
      scope: ['user.read'],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Professor Strategy
passport.use(
  'professor-microsoft',
  new MicrosoftStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/v1/professor/auth/callback`,
      scope: ['user.read'],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);


app.get('/api/v1/administration/auth/microsoft', passport.authenticate('administration-microsoft'));
app.get('/api/v1/professor/auth/microsoft', passport.authenticate('professor-microsoft'));
app.get('/api/v1/student/auth/microsoft', passport.authenticate('student-microsoft'));


passport.serializeUser((user, done) => {
  done(null, user); // Save the whole user object or a specific identifier
});

passport.deserializeUser((user, done) => {
  done(null, user); // Retrieve the saved user data from the session
});

// Middleware
app.use(passport.initialize());

app.get('/api/v1/auth/microsoft', passport.authenticate('microsoft'));


app.get('/api/v1/auth/failure', (req, res) => {
  res.send('Authentication failed!');
});



// Routes
  app.use("/api/v1/administration", administrationRoute);
  app.use("/api/v1/professor", professorRoute);
  app.use("/api/v1/student", studentRoute);
  app.use("/api/v1/logout", logout);


// Folder to serve PDF files
const pdfDirectory = path.resolve("uploads"); // Change 'uploads' to your actual folder
app.use("/api/v1/files", express.static(pdfDirectory));

// Dynamic endpoint to serve specific files
app.get("/api/v1/files/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(pdfDirectory, fileName);

  if (!fileName || !fileName.endsWith(".pdf")) {
    return res.status(400).json({ error: "Invalid file request" });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(500).json({ error: "File download failed" });
    }
  });
});

// Server initialization
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
