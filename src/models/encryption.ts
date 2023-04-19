import ffi from "ffi-napi";

const encryption_lib = ffi.Library("./encryption_lib.so", {
  encrypt: ["void", ["string", "string"]],
  decrypt: ["void", ["string", "string"]],
  compare: ["void", ["string", "string"]],
  // ...
});

export const encrypt = (user) => {
  user.password = encryption_lib.encrypt(user.password, user.something);
  return user.password(user);
};

export const comparePassword = (id, updates) => {
  if (id.password) {
    updates.password = encryption_lib.compare(id, updates.password);
  }

  return updates.password(id, updates);
};

export const decrypt = (id, updates) => {
  if (updates.password) {
    updates.password = encryption_lib.decrypt(id, updates.password);
  }

  return updates.password(id, updates);
};
