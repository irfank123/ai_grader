require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const examRouter = require("./routes/examRoutes");
const questionRouter = require("./routes/questionRoutes");
const responseRouter = require("./routes/responseRoutes");
const userRouter = require("./routes/userRoutes");
const audioRouter = require("./routes/audioTranscriptionRoutes");

// express app
const app = express();

// // middlewares
// app.use(helmet());

// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
//   app.use(cors({ credentials: true, origin: `http://localhost:3001` }));
// } else {
//   const limiter = rateLimit({
//     max: 100,
//     windowMs: 60 * 60 * 1000,
//     message: "Too many requests from this IP, please try again in an hour",
//   });
//   app.use("/api", limiter);
// }
// app.use(compression());
// app.use(express.json());
// app.get("/test", (req, res) => {
//   res.send("Test route is working!");
// });
// app.use("/api/v1/exams", examRouter);
// app.use("/api/v1/questions", questionRouter);
// app.use("/api/v1/responses", responseRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/uploads", audioRouter);

app.use(helmet());
// app.use(morgan("dev")); // Only in development
app.use(cors({ credentials: true, origin: "http://localhost:3001" })); // CORS setup
app.use(compression());
app.use(express.json()); // JSON body parser

// Test route (to verify the server works before the routes)
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// Main routes
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/responses", responseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/uploads", audioRouter);

module.exports = app;
