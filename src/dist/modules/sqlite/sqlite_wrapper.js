"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// sqlite wrapper calls
const ffi_napi_1 = __importDefault(require("ffi-napi"));
// c function signature
const db_calls = ffi_napi_1.default.Library("/sqlite/output_sqlite_libc.so", {
    //   note to self - function returns an int and takes two args, a string and an int
    //   c_sqlite3_open: ["int", ["string", "pointer"]],
    c_sqlite3_close: ["int", ["int"]],
});
const c_funtion_op = ffi_napi_1.default.Function("int", ["string", "pointer"]);
exports.default = c_funtion_op;
// call the C function and handle the return value
const result = db_calls.c_sqlite3_close(42);
if (result === 0) {
    console.log("C function call succeeded!");
}
else {
    console.error("C function call failed with error code:", result);
}
