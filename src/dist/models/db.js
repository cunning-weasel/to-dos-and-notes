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
exports.customSqLiteStore = exports.removeCompletedToDo = exports.removeToDo = exports.updateToDo = exports.insertIntoToDos = exports.getUserId = exports.getUserName = exports.createUser = exports.showDbData = exports.closeDb = exports.openDb = void 0;
const ffi_napi_1 = __importDefault(require("ffi-napi"));
// function signatures
const db_lib = ffi_napi_1.default.Library("modules/sqlite/sqlite_wrapper_libc.so", {
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
    // store ops
    load_session: ["void", ["string"]],
    upsert_session: ["void", ["string", "int"]],
    update_session: ["void", ["string", "int"]],
    delete_session: ["void", ["string"]],
});
// db ops
const openDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.open_db();
    }
    catch (err) {
        return err;
    }
});
exports.openDb = openDb;
const closeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.close_db();
    }
    catch (err) {
        return err;
    }
});
exports.closeDb = closeDb;
const showDbData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.show_data_db();
    }
    catch (err) {
        return err;
    }
});
exports.showDbData = showDbData;
// user ops
const createUser = (username, hashedPassWord, salt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.create_user(username, hashedPassWord, salt);
    }
    catch (err) {
        return err;
    }
});
exports.createUser = createUser;
const getUserName = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.username_get(username);
    }
    catch (err) {
        return err;
    }
});
exports.getUserName = getUserName;
const getUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.get_by_owner_id(id);
    }
    catch (err) {
        return err;
    }
});
exports.getUserId = getUserId;
// todo ops
const insertIntoToDos = (id, title, completed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.insert_data_into_todos(id, title, completed);
    }
    catch (err) {
        return err;
    }
});
exports.insertIntoToDos = insertIntoToDos;
const updateToDo = (title, completed, id, owner_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.update_todo(title, completed, id, owner_id);
    }
    catch (err) {
        return err;
    }
});
exports.updateToDo = updateToDo;
const removeToDo = (id, owner_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.remove_todo(id, owner_id);
    }
    catch (err) {
        return err;
    }
});
exports.removeToDo = removeToDo;
const removeCompletedToDo = (id, completed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_lib.remove_completed_todo(id, completed);
    }
    catch (err) {
        return err;
    }
}); // const MemoryStoreConstructor = MemoryStore(session);
exports.removeCompletedToDo = removeCompletedToDo;
// const memoryStore = new MemoryStoreConstructor(options);
// store ops
// need all methods for custom store impl.
// thank gawd for .ts auto-everything
class customSqLiteStore {
    constructor() {
        // start custom impl
        this.get = (sid, callback) => __awaiter(this, void 0, void 0, function* () {
            // should generate sid here?
            //
            try {
                const session = yield db_lib.load_session(sid);
                callback(null, session);
            }
            catch (err) {
                callback(err, session);
            }
        });
        this.set = (sid, session, callback) => __awaiter(this, void 0, void 0, function* () {
            // update && insert session
            try {
                yield db_lib.upsert_session(sid, session);
                callback === null || callback === void 0 ? void 0 : callback();
            }
            catch (err) {
                callback === null || callback === void 0 ? void 0 : callback(err);
            }
        });
        this.touch = (
        // const options {
        //   checkPeriod: 20 * 60 * 1000, // check for expired sessions every 20 minutes
        //   maxAge: 50 * 60 * 1000, // sessions expire after 50 minutes
        // };
        sid, session, callback) => __awaiter(this, void 0, void 0, function* () {
            // update session, resets timer
            try {
                yield db_lib.update_session(sid, session.cookie.maxAge);
                callback === null || callback === void 0 ? void 0 : callback();
            }
            catch (err) {
                callback === null || callback === void 0 ? void 0 : callback(err);
            }
        });
        this.destroy = (sid, callback) => __awaiter(this, void 0, void 0, function* () {
            // delete session
            try {
                yield db_lib.delete_session(sid);
                callback === null || callback === void 0 ? void 0 : callback();
            }
            catch (err) {
                callback === null || callback === void 0 ? void 0 : callback(err);
            }
        });
    }
    // end custom impl methods
    clear(callback) {
        throw new Error("Method not implemented.");
    }
    all(callback) {
        throw new Error("Method not implemented.");
    }
    length(callback) {
        throw new Error("Method not implemented.");
    }
    regenerate(req, callback) {
        throw new Error("Method not implemented.");
    }
    load(sid, callback) {
        throw new Error("Method not implemented.");
    }
    createSession(req, session) {
        throw new Error("Method not implemented.");
    }
    addListener(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    on(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    once(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    removeListener(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    off(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event) {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n) {
        throw new Error("Method not implemented.");
    }
    getMaxListeners() {
        throw new Error("Method not implemented.");
    }
    listeners(eventName) {
        throw new Error("Method not implemented.");
    }
    rawListeners(eventName) {
        throw new Error("Method not implemented.");
    }
    emit(eventName, ...args) {
        throw new Error("Method not implemented.");
    }
    listenerCount(eventName) {
        throw new Error("Method not implemented.");
    }
    prependListener(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(eventName, listener) {
        throw new Error("Method not implemented.");
    }
    eventNames() {
        throw new Error("Method not implemented.");
    }
}
exports.customSqLiteStore = customSqLiteStore;
// note to self - function returns an int and takes two args, a string and a pointer: ["int", ["string", "pointer"]]
// c_func: ["int", ["string", "pointer"]],
