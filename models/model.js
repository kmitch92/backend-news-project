const db = require("../db/connection");

exports.fetchTopics = async () => {
  const { rows: result } = await db.query("SELECT * FROM topics;");

  return result;
};
