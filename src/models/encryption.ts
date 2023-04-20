import ffi from "ffi-napi";

const encryption_lib = ffi.Library("./modules/encryption_lib.so", {
  encrypt: ["void", ["string", "string"]],
  decrypt: ["void", ["string", "string"]],
  compare: ["string", ["string", "string"]],
  // ...
  // general connection stuff?
});

export const encrypt = (password: string, encryptedPassword: string) => {
  return encryption_lib.encrypt(password, encryptedPassword);
};

export const decrypt = (password: string, decryptedPassword: string) => {
    return encryption_lib.decrypt(password, decryptedPassword);
};

export const comparePassword = (password: string, passwordUser: string): string => {
    return encryption_lib.compare(password, passwordUser);
};
