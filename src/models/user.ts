import {
  getUserByIdC,
  getUserByUsernameC,
  createUserC,
  updateUserC,
} from "./mylib/sqlite";
import encryptPassword from "./mylib/encryption";

export const getUserById = (id) => {
  return getUserByIdC(id);
};

export const getUserByUsername = (username) => {
  return getUserByUsernameC(username);
};

export const createUser = (user) => {
  // encrypt the user's password before creating the user
  user.password = encryptPassword(user.password);
  return createUserC(user);
};

export const updateUser = (id, updates) => {
  // encrypt the user's new password before updating the user
  if (updates.password) {
    updates.password = encryptPassword(updates.password);
  }

  return updateUserC(id, updates);
};
