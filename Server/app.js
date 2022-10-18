const express = require("express");
const cores = require("cors");

const { serverLogger } = require("./logs/winston");

require("dotenv").config();
const mongoose = require("mongoose");

const PORT = process.env.PORT;

const app = express();

app.use(cores());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(serverLogger.info("DB_Connected!!"))
  .catch((err) => serverLogger.error(err.message));

const server = app.listen(PORT, () => {
  serverLogger.info("Server_Start");
});
