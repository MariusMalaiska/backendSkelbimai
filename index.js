require("dotenv").config();

// process.env.Port ||
// const Port = process.env.MONGODB_URI || process.env.DB_HOST;
// const Port =
//   "mongodb://admin11:admin11@ds051658.mlab.com:51658/heroku_jzcbn16d";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes/routes");

mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

const corsOptions = {
  exposedHeaders: ["x-auth-node"]
};

app.use("/upload", express.static("upload"));

app.use(cors(corsOptions));

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use("/v1", router);

app.listen(3003);
