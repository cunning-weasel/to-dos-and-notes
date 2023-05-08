"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.decrypt = exports.encrypt = void 0;
const ffi_napi_1 = __importDefault(require("ffi-napi"));
const encryption_lib = ffi_napi_1.default.Library("modules/encryption/encryption_wrapper_libc.so", {
    encryptor: ["int", ["string", "string", "int"]],
    // ...
});
const encrypt = (input, output) => {
    encryption_lib.encryptor(input, output, 1);
    return input && output;
};
exports.encrypt = encrypt;
const decrypt = (input, output) => {
    encryption_lib.encryptor(input, output, 0);
    return output;
};
exports.decrypt = decrypt;
const comparePassword = (encryptedPw, encryptedPwDb) => {
    return encryptedPw === encryptedPwDb ? true : false;
};
exports.comparePassword = comparePassword;
