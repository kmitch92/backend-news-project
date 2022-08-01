const db = require("../db/connection");

exports.fetchTopics = async () => {
  const { rows: result } = await db.query("SELECT * FROM topics;");

  return result;
};

exports.fetchArticleById = async (id) => {
  const { rows: result } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id.article_id]
  );

  if (result.length < 1) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  } else {
    return result[0];
  }
};
