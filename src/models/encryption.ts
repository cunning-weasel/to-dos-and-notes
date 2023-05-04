import ffi from "ffi-napi";

const encryption_lib = ffi.Library("./modules/encryption_lib.so", {
  encryptor: ["int", ["string", "string", "int"]],
  // ...
});

export const encrypt = (input: string, output: string): string => {
  encryption_lib.encryptor(input, output, 1);
  return input && output;
};

export const decrypt = (input: string, output: string): string => {
  encryption_lib.encryptor(input, output, 0);
  return output;
};

export const comparePassword = (
  encryptedPw: string,
  encryptedPwDb: string
): boolean => {
  return encryptedPw === encryptedPwDb ? true : false;
};

