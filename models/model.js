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

  const { rows: comments } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id.article_id]
  );

  if (result.length < 1) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  } else {
    result[0].comment_count = comments.length;
    return result[0];
  }
};

exports.updateArticleById = async (articleId, newVoteInfo) => {
  if (!newVoteInfo.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "Invalid Request Body" });
  }
  const newVote = newVoteInfo.inc_votes;

  const articleBeforeUpdate = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [articleId.article_id]
  );

  if (articleBeforeUpdate.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  }

  const currentVotes = articleBeforeUpdate.rows[0].votes;
  const updatedVotes = currentVotes + newVote;

  const { rows: result } = await db.query(
    "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;",
    [updatedVotes, articleId.article_id]
  );

  if (result.length < 1) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  } else {
    return result[0];
  }
};

exports.fetchUsers = async () => {
  const { rows: result } = await db.query("SELECT * FROM users");
  return result;
};
