// sqlite wrapper calls
import ffi from "ffi-napi";

interface sqlite_wrapper_row_callback {
  lib: [int: number, char: string[], char: string[]];
}

// need to compile this to lib to test, but there's 
// still way too much to do
const row_callback: sqlite_wrapper_row_callback = ffi.Library(
  "sqlite_wrapper_libc.so",
  {
    lib: ["int", ["char", "char"]],
  }
);

export default row_callback;
