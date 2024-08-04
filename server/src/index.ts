const express = require("express");
const cors = require("cors");
const app = express();
const connectDatabase = require("./config/database");

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

connectDatabase();
