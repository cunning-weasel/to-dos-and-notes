"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randUuid = exports.comparePassword = exports.decrypt = exports.encrypt = void 0;
const ffi_napi_1 = __importDefault(require("ffi-napi"));
const encryption_lib = ffi_napi_1.default.Library("modules/encryption/encryption_wrapper_libc.so", {
    encryptor: ["int", ["string", "string", "int"]],
    gen_random_uuid: ["string", ["void"]],
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
const comparePassword = (encryptedPw, encryptedPwDb) => __awaiter(void 0, void 0, void 0, function* () {
    return encryptedPw === encryptedPwDb ? true : false;
});
exports.comparePassword = comparePassword;
const randUuid = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield encryption_lib.gen_random_uuid();
    }
    catch (err) {
        return err;
    }
});
exports.randUuid = randUuid;
