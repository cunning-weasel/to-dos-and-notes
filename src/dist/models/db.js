"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCompletedToDo = exports.removeToDo = exports.updateToDo = exports.insertIntoToDos = exports.getUserId = exports.getUserName = exports.createUser = exports.showDbData = exports.closeDb = exports.openDb = void 0;
const ffi_napi_1 = __importDefault(require("ffi-napi"));
// function signatures
const db_lib = ffi_napi_1.default.Library("../modules/sqlite/output_sqlite_libc.so", {
    open_db: ["int", ["void"]],
    close_db: ["int", ["void"]],
    show_data_db: ["int", ["void"]],
    // user ops
    create_user: ["int", ["string", "string", "string"]],
    username_get: ["int", ["string"]],
    get_by_owner_id: ["int", ["int"]],
    // todo ops
    insert_data_into_todos: ["int", ["int", "string", "int"]],
    update_todo: ["int", ["string", "int", "int", "int"]],
    remove_todo: ["int", ["int", "int"]],
    remove_completed_todo: ["int", ["int", "int"]],
});
// db ops
const openDb = () => {
    return db_lib.open_db();
};
exports.openDb = openDb;
const closeDb = () => {
    return db_lib.close_db();
};
exports.closeDb = closeDb;
const showDbData = () => {
    return db_lib.show_data_db();
};
exports.showDbData = showDbData;
// user ops
const createUser = (username, hashedPassWord, salt) => {
    return db_lib.create_user(username, hashedPassWord, salt);
};
exports.createUser = createUser;
const getUserName = (username) => {
    return db_lib.username_get(username);
};
exports.getUserName = getUserName;
const getUserId = (id) => {
    return db_lib.get_by_owner_id(id);
};
exports.getUserId = getUserId;
// todo ops
const insertIntoToDos = (id, title, completed) => {
    return db_lib.insert_data_into_todos(id, title, completed);
};
exports.insertIntoToDos = insertIntoToDos;
const updateToDo = (title, completed, id, owner_id) => {
    return db_lib.update_todo(title, completed, id, owner_id);
};
exports.updateToDo = updateToDo;
const removeToDo = (id, owner_id) => {
    return db_lib.remove_todo(id, owner_id);
};
exports.removeToDo = removeToDo;
const removeCompletedToDo = (id, completed) => {
    return db_lib.remove_completed_todo(id, completed);
};
exports.removeCompletedToDo = removeCompletedToDo;
// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],
