// sqlite wrapper calls
import ffi from "ffi-napi";

export interface encryption_wrapper_calls {
  lib: [int: number, char: string[], char: string[]];
}

export const run_encryption: encryption_wrapper_calls = ffi.Library(
  "sqlite_wrapper_libc.so",
  {
    lib: ["int", ["char", "char"]],
  }
);
