import ffi from "ffi-napi";

export const mylib = ffi.Library("./mylib.so", {
  encrypt: ["void", ["string", "string"]],
  decrypt: ["void", ["string", "string"]],
});

