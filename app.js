const express = require("express");
const { getTopics } = require("./controllers/controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

////////// ENDPOINT ERROR

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint not found" })
);

////////// OTHER ERRORS

module.exports = app;
