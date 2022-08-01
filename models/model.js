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

exports.updateArticleById = async (articleId, newVoteInfo) => {
  const newVote = newVoteInfo.inc_votes;

  console.log(newVote);

  const articleBeforeUpdate = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [articleId.article_id]
  );

  //   let articleBeforeUpdate;

  //   try {
  //     articleBeforeUpdate = await db.query(
  //       "SELECT * FROM articles WHERE article_id = $1;",
  //       [articleId.article_id]
  //     );
  //   } catch {
  //     console.log(articleBeforeUpdate);
  //     return Promise.reject({ status: 404, msg: "Article Not Found" });
  //   }

  console.log("32", articleBeforeUpdate.rows[0].votes);

  const currentVotes = articleBeforeUpdate.rows[0].votes;
  const updatedVotes = currentVotes + newVote;

  const { rows: result } = await db.query(
    "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;",
    [updatedVotes, articleId.article_id]
  );
  console.log(result);
  if (result.length < 1) {
    return Promise.reject({ status: 404, msg: "Article Not Found" });
  } else {
    return result[0];
  }
};
