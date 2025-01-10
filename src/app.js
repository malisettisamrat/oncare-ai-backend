const express = require("express");
const dotenv = require("dotenv");
const mongooseConnection = require("./config/db");

const router = require("./routes/index");

// load the env variables...
dotenv.config();

// connect to mongodb..
mongooseConnection();

// Initiate express app..
const app = express();
app.use(express.json());

app.use("/", router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
