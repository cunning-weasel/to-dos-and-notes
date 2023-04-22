import ffi from "ffi-napi";

import { encrypt } from "./encryption";
// function signatures
const db_lib = ffi.Library("../modules/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
  // c_func: ["int", ["string", "pointer"]],
  open_db: ["int", ["void"]],
  close_db: ["void", ["void"]],
  // user ops
  username_get: ["int", ["string"]],
  id_user_get: ["int", ["int"]],
  create_user: ["int", ["string", "string", "string"]],
  // todo ops
  // ..
});

export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = () => {
  return db_lib.close_db();
};

export const getUserName = (username: string): number => {
  return db_lib.username_get(username);
};

export const getUserId = (id: number): number => {
  return db_lib.id_user_get(id);
};

// TODO
// create initial user with hashed & salty password
export const createUser = (
  username: string,
  hashedPassWord: string,
  salt: string
): number => {
  const storeHashedPassWord = encrypt(password, hashedPassWord);
  return db_lib.create_user(username, storeHashedPassWord, salt);
};
