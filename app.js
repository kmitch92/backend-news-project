const express = require("express");
const { getTopics, getArticleById } = require("./controllers/controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

////////// ENDPOINT ERROR

app.all("/*", (req, res) =>
  res.status(404).send({ msg: "Endpoint Not Found" })
);

////////// OTHER ERRORS

app.use((err, req, res, next) => {
  console.log("count how many times you see this message");
  if (err.code === "22P02") {
    console.log(err.code);
    res.status(400).send({ msg: "Invalid ID Type" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log("shouldnt get this far");
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
