"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite_wrapper_1 = __importDefault(require("../modules/sqlite/sqlite_wrapper"));
sqlite_wrapper_1.default.run("CREATE TABLE IF NOT EXISTS users ( \
      id INTEGER PRIMARY KEY, \
      username TEXT UNIQUE, \
      hashed_image BLOB, \
      salt BLOB, \
      name TEXT, \
      email TEXT UNIQUE, \
      email_verified INTEGER \
    )");
exports.default = sqlite_wrapper_1.default;
