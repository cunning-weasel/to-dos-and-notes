import create_table_todos_db from "../modules/sqlite/sqlite_wrapper";

create_table_todos_db.run(
  "CREATE TABLE IF NOT EXISTS todos ( \
    id INTEGER PRIMARY KEY, \
    owner_id INTEGER NOT NULL, \
    title TEXT NOT NULL, \
    completed INTEGER \
  )"
);

export default create_table_todos_db;
