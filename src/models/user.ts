import ffi from "ffi-napi";

// import {
//   getUserByIdC,
//   getUserByUsernameC,
//   createUserC,
//   updateUserC,
// } from "/models/app";

const encryption_lib = ffi.Library("./encryption_lib.so", {
  encrypt: ["void", ["string", "string"]],
  // decrypt: ["void", ["string", "string"]],
  // ...
});

export const getUserById = (id: string) => {
  return getUserByIdC(id);
};

export const getUserByUsername = (username: string) => {
  return getUserByUsernameC(username);
};

export const createUser = (user) => {
  // encrypt the user's password before creating the user
  user.password = encryption_lib.encrypt(user.password, user.something);
  return createUserC(user);
};

export const updateUser = (id, updates) => {
  // encrypt the user's new password before updating the user
  if (updates.password) {
    updates.password = encryption_lib.encrypt(id, updates.password);
  }

  return updateUserC(id, updates);
};
