exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

// exports.checkEntryExists = async (db, table, column, id) => {
//   const dbOutput  = await db.query(`SELECT * FROM $1 WHERE $2 = $3`, [
//     table,
//     column,
//     id,
//   ]);
//   if (dbOutput.rows.length === 0) return false;
//   else return true;
// };
