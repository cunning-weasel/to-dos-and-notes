import ffi from "ffi-napi";

import { encrypt } from "./encryption";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
  // open_db: ["int", ["string", "pointer"]],
  open_db: ["int", ["void"]],
  close_db: ["void", ["void"]],
  // create table users
  //
  // create table todos

  // user ops
  username_get: ["int", ["string"]],
  // todo ops
  // ..
});

export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = () => {
  return db_lib.close_db();
};

export const getToDoById = (ownerId: number): number => {
  return db_lib.GetToDo_By_Id(ownerId);
};

export const createToDo = (user) => {
  user.password = encrypt(user.password);
  return db_lib.create_to_do(user);
};

export const updateToDo = (id, updates) => {
  // encrypt
  if (updates.password) {
    return encrypt(id, updates);
  }
};

export const getUserName = (username: string): number => {
  return db_lib.username_get(username);
};

// TODO
// create initial user with hashed password
