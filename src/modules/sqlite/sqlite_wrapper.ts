// sqlite wrapper calls
import ffi from "ffi-napi";

// c function signature
const db = ffi.Library("/sqlite/output_sqlite_libc.so", {
  //   note to self - function returns an int and takes two args, a string and an int
  //   Cqlite3_open: ["int", ["string", "pointer"]],
  Cqlite3_close: ["int", ["int"]],
});

export default db;

// call the C function and handle the return value
// i.e import db from "where-ever"
// const result: number = db.Cqlite3_close(42);
// if (result === 0) {
//   console.log("Cql call succeeded!");
// } else {
//   console.error("Cql function call failed with error code:", result);
// }
