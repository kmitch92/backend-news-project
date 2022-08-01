const { fetchTopics, fetchArticleById } = require("../models/model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params;
  console.log(articleId, "articleId @ controller in");
  fetchArticleById(articleId)
    .then((article) => {
      console.log(article, "article @ controller out");
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err, "error came back to controller");
      next(err);
    });
};
