const db = require("../db/connection");

exports.fetchTopics = async () => {
  const { rows: result } = await db.query("SELECT * FROM topics;");

  return result;
};

exports.fetchArticleById = async (id) => {
  const {
    rows: [result],
  } = await db.query(
    `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  WHERE articles.article_id=$1 
  GROUP BY articles.article_id
  ;`,
    [id.article_id]
  );

  if (result === undefined) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  } else {
    result.comment_count = parseInt(result.comment_count);
    return result;
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
    return result;
  }
};

exports.fetchUsers = async () => {
  const { rows: result } = await db.query("SELECT * FROM users");
  return result;
};

exports.fetchArticles = async () => {
  const { rows: result } = await db.query(
    `SELECT articles.article_id AS article_id, articles.author AS author, title, articles.body AS body, topic, articles.created_at AS created_at, articles.votes AS votes, COUNT(comment_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
  );

  return result;
};
