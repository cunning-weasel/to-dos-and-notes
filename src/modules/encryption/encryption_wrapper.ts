import ffi from "ffi-napi";

export const encryption_lib = ffi.Library("./encryption_lib.so", {
  encrypt: ["void", ["string", "string"]],
  decrypt: ["void", ["string", "string"]],
  // ...
});

