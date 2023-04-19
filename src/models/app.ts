import ffi from "ffi-napi";
import encryptPassword from "./mylib/encryption";

// c function signature
const db = ffi.Library("/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and an int
  //   Cqlite3_open: ["int", ["string", "pointer"]],
  Cqlite3_close: ["int", ["int"]],
});

// add to c code
// db.run("CREATE TABLE IF NOT EXISTS users ( \
//   id INTEGER PRIMARY KEY, \
//   username TEXT UNIQUE, \
//   hashed_password BLOB, \
//   salt BLOB \
// )");

// db.run("CREATE TABLE IF NOT EXISTS todos ( \
//   id INTEGER PRIMARY KEY, \
//   owner_id INTEGER NOT NULL, \
//   title TEXT NOT NULL, \
//   completed INTEGER \
// )");

export const getToDoById = (id) => {
  return getToDoByIdC(id);
};

export const getOwnerById = (username) => {
  return getOwnerByIdC(username);
};

export const createToDo = (user) => {
  // encrypt the to-dos
  user.password = encryptPassword(user.password);
  return createToDoC(user);
};

export const updateToDo = (id, updates) => {
  // encrypt stuff
  if (updates.password) {
    updates.password = encryptPassword(updates.password);
  }

  return updateToDoC(id, updates);
};
