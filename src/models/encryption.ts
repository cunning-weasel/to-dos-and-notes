import ffi from "ffi-napi";

const encryption_lib = ffi.Library("./modules/encryption_lib.so", {
  encrypt: ["int", ["string", "string"]],
  decrypt: ["int", ["string", "string"]],
  compare: ["int", ["string", "string"]],
  // ...
});

export const encrypt = (
  password: string,
  encryptedPassword: string
): number => {
  return encryption_lib.encrypt(password, encryptedPassword);
};

export const decrypt = (
  encryptedPassword: string,
  decryptedPassword: string
): number => {
  return encryption_lib.decrypt(encryptedPassword, decryptedPassword);
};

// refactor - can be simple bool type return
export const comparePassword = (
  password: string,
  hashedPassword: string
): number => {
  return encryption_lib.compare(password, hashedPassword);
};
