import ffi from "ffi-napi";

const encryption_lib = ffi.Library(
  "modules/encryption/encryption_wrapper_libc.so",
  {
    encryptor: ["int", ["string", "string", "int"]],
    gen_random_uuid: ["string", ["void"]],
    // ...
  }
);

export const encrypt = (input: string, output: string): string => {
  encryption_lib.encryptor(input, output, 1);
  return input && output;
};

export const decrypt = (input: string, output: string): string => {
  encryption_lib.encryptor(input, output, 0);
  return output;
};

export const comparePassword = async (
  encryptedPw: string,
  encryptedPwDb: string
): Promise<boolean> => {
  return encryptedPw === encryptedPwDb ? true : false;
};

export const randUuid = async (): Promise<string> => {
  try {
    await encryption_lib.gen_random_uuid();
  } catch (err) {
    return err;
  }
};
