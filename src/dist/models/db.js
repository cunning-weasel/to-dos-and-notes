// import create_table_db from "../modules/sqlite/sqlite_wrapper";
// create_table_db.serialize(function () {
//   create_table_db.run(
//     "CREATE TABLE IF NOT EXISTS users ( \
//     id INTEGER PRIMARY KEY, \
//     username TEXT UNIQUE, \
//     hashed_image BLOB, \
//     salt BLOB, \
//     name TEXT, \
//     email TEXT UNIQUE, \
//     email_verified INTEGER \
//   )"
//   );
//   create_table_db.run(
//     "CREATE TABLE IF NOT EXISTS todos ( \
//     id INTEGER PRIMARY KEY, \
//     owner_id INTEGER NOT NULL, \
//     title TEXT NOT NULL, \
//     completed INTEGER \
//   )"
//   );
// });
// export default create_table_db;
