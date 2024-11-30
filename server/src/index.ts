import express from "express";

const userRoutes = require("./routes/user.routes");
const quizRoutes = require("./routes/quiz.routes");
const achievementRoutes = require("./routes/achievement.routes");
const commentRoutes = require("./routes/comment.routes");
const ratingRoutes = require("./routes/rating.routes");

const connectDatabase = require("./config/database");

const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());

const allowedOrigins = process.env.ORIGINS
  ? process.env.ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: (origin: string, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

connectDatabase();

app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/rating", ratingRoutes);
