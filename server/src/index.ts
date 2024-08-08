const express = require("express");
const cors = require("cors");
const app = express();
const connectDatabase = require("./config/database");
const userRoutes = require("./routes/user.route");
const quizRoutes = require("./routes/quiz.route");
const achievementRoutes = require("./routes/achievement.route");

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

connectDatabase();

app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/achievement", achievementRoutes);
