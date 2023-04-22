import ffi from "ffi-napi";

const encryption_lib = ffi.Library("./modules/encryption_lib.so", {
  encryptor: ["int", ["string", "string", "int"]],
  // ...
});

export const encrypt = (input: string, output: string): number => {
  return encryption_lib.encryptor(input, output, 1);
  // return output instead?
};

export const decrypt = (input: string, output: string): number => {
  return encryption_lib.encryptor(input, output, 0);
  // return output instead?
};

export const comparePassword = (input, output): boolean => {
  return encrypt === decrypt;
};
