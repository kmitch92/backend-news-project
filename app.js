const express = require("express");
const {
  getTopics,
  getArticleById,
  patchArticleById,
} = require("./controllers/controller");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

////////// ENDPOINT ERROR

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint Not Found" })
);

////////// OTHER ERRORS

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID Type" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
