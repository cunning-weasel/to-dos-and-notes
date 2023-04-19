import ffi from "ffi-napi";
import encryptPassword from "./mylib/encryption";

// c function signature
const db = ffi.Library("/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and an int
  Cqlite3_open: ["int", ["string", "pointer"]],
  Cqlite3_close: ["int", ["int"]],
  GetToDo_By_Id: ["int", ["int"]],

  // ...
});

// call the C function and handle the return value
const openDb: number = (id: number) => {
  return db.Cqlite3_open(id);
};

const closeDb: number = () => {
  return db.Cqlite3_close(id);
};

export const getToDoById = (id) => {
  return db.GetToDo_By_Id(id);
};

export const getOwnerById = (username) => {
  return db.getOwnerByIdC(username);
};

export const createToDo = (user) => {
  // encrypt the to-dos - pull in func from encryption model
  user.password = encryptPassword(user.password);
  return db.createToDoC(user);
};

export const updateToDo = (id, updates) => {
  // encrypt stuff
  if (updates.password) {
    updates.password = encryptPassword(updates.password);
  }

  return updateToDoC(id, updates);
};

// create an initial user (username: alice, password: letmein) with added salt
