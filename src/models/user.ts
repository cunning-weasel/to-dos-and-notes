import create_table_users_db from "../modules/sqlite/sqlite_wrapper";

create_table_users_db.run(
  "CREATE TABLE IF NOT EXISTS users ( \
      id INTEGER PRIMARY KEY, \
      username TEXT UNIQUE, \
      hashed_image BLOB, \
      salt BLOB, \
      name TEXT, \
      email TEXT UNIQUE, \
      email_verified INTEGER \
    )"
);

export default create_table_users_db;
