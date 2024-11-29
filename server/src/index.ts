import express from "express";

const userRoutes = require("./routes/user.routes");
const quizRoutes = require("./routes/quiz.routes");
const achievementRoutes = require("./routes/achievement.routes");
const commentRoutes = require("./routes/comment.routes");
const ratingRoutes = require("./routes/rating.routes");

const connectDatabase = require("./config/database");

const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "https://quizora-grochowp.netlify.app", // Zaufana domena frontendowa
  credentials: true, // Zezwala na wysyłanie ciasteczek
};

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
