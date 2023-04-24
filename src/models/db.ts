import ffi from "ffi-napi";

import { encrypt } from "./encryption";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
  open_db: ["int", ["void"]],
  close_db: ["void", ["void"]],
  show_data: ["int", ["void"]],
  // user ops
  create_user: ["int", ["string", "string", "string"]],
  username_get: ["int", ["string"]],
  get_by_owner_id: ["int", ["int"]],
  // todo ops
  update_todo: ["int", ["string", "int", "int", "int"]],
  remove_todo: ["int", ["int", "int"]],
  remove_completed_todo: ["int", ["int", "int"]],
});

// db ops
export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = () => {
  return db_lib.close_db();
};
// user ops
// TODOcreate initial user with hashed & salty password
export const createUser = (
  username: string,
  hashedPassWord: string,
  salt: string
): number => {
  const storeHashedPassWord = encrypt(password, hashedPassWord);
  return db_lib.create_user(username, storeHashedPassWord, salt);
};

export const getUserName = (username: string): number => {
  return db_lib.username_get(username);
};

export const getUserId = (id: number): number => {
  return db_lib.get_by_owner_id(id);
};
// todo ops

// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],
