require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const passport = require("passport");
const session = require("express-session");
const examRouter = require("./routes/examRoutes");
const questionRouter = require("./routes/questionRoutes");
const responseRouter = require("./routes/responseRoutes");
const userRouter = require("./routes/userRoutes");
const audioRouter = require("./routes/audioTranscriptionRoutes");
const authRouter = require("./routes/authRoutes");
// const uploadRouter = require("./routes/gcsRoutes");
const submitRouter = require("./routes/aiRoutes");
const gcsRouter = require("./routes/gcsRoutes");

// express app
const app = express();

// middlewares
app.use(helmet());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
  app.use(cors({ credentials: true, origin: `http://localhost:3001` }));
} else {
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour",
  });
  app.use("/api", limiter);
}
app.use(compression());
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require("./controllers/authController")(passport);

app.use("/api/v1/exams", examRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/responses", responseRouter);
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/uploads", audioRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/upload", gcsRouter);
app.use("/api/v1/submit", submitRouter);
module.exports = app;
