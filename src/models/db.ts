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
  // todo ops
  // ..
});

export const openDb = (): number => {
  return db_lib.open_db();
};

export const closeDb = () => {
  return db_lib.close_db();
};

export const encryptPassword = (user) => {
  user.password = encrypt(user.password, user.hashedPassword);
};

export const getUserName = (username: string): number => {
  return db_lib.username_get(username);
};

export const getUserId = (id: number): number => {
  return db_lib.id_user_get(id);
};

// export const updateToDo = (id, text) => {
//   // encrypt
//   if (updates.password) {
//     return encrypt(id, updates);
//   }
// };

// TODO
// create initial user with hashed password
