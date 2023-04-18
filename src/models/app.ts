import {
  getToDoByIdC,
  getOwnerByIdC,
  createToDoC,
  updateToDoC,
} from "./mylib/sqlite";
import encryptPassword from "./mylib/encryption";

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
