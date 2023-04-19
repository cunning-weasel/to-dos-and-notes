import ffi from "ffi-napi";

import { encrypt } from "./encryption";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
  open_db_c: ["int", ["string", "pointer"]],
  close_db_c: ["string", ["string"]],
  // create table users
  // 
  // create table todos

  // user ops
  // ...
  // todo ops
  // ..
  GetToDo_By_Id: ["int", ["int"]],
});

export const openDb = (id: string, ptr: any): number => {
  return db_lib.open_db_c(id, ptr);
};

export const closeDb = (id: string): string => {
  return db_lib.close_db_c(id);
};

export const getToDoById = (ownerId: number): number => {
  return db_lib.GetToDo_By_Id(ownerId);
};

export const createToDo = (user) => {
  user.password = encrypt(user.password);
  return db_lib.create_to_do_c(user);
};

export const updateToDo = (id, updates) => {
  // encrypt
  if (updates.password) {
    updates.password = encrypt(updates.password);
  }

  return update_to_do_c(id, updates);
};

// create an initial user (username: alice, password: letmein) with added salt
