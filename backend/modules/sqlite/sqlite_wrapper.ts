// sqlite wrapper calls
import ffi from "ffi-napi";

export interface sqlite_wrapper_c_calls {
  lib: [(arg: number) => number];
}

// export const funcs?: sqlite_wrapper_c_calls = ffi.Library(
//   "sqlite_wrapper_libc.so",
//   {
//     lib: ["int", ["int"]],
//   }
// );
