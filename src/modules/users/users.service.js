const db = require('./users.db');

exports.searchUsersByName = async (name) => {
  if (!name || name.length < 2) {
    throw new Error('Name query must be at least 2 characters');
  }
  return await db.searchUsersByName(name);
};
