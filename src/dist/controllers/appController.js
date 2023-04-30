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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToDo = exports.patchToDo = exports.postToDO = exports.getToDo = void 0;
const db_1 = require("../models/db");
// todo/ note data
const getToDo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield (0, db_1.getUserId)(req.user.id));
        let rows, todos;
        todos = rows.map((row) => {
            return {
                id: row.id,
                title: row.title,
                completed: row.completed == 1 ? true : false,
                url: "/app" + row.id,
            };
        });
        res.locals.todos = todos;
        res.locals.activeCount = todos.filter(function (todo) {
            return !todo.completed;
        }).length;
        res.locals.completedCount = todos.length - res.locals.activeCount;
        next();
    }
    catch (err) {
        console.error(`Error while getting to-do/ notes`, err.message);
        next(err);
    }
});
exports.getToDo = getToDo;
const postToDO = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield createToDo(req.body));
    }
    catch (err) {
        console.error(`Error while creating to-do/ note`, err.message);
        next(err);
    }
});
exports.postToDO = postToDO;
const patchToDo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield updateToDo(req.params.id, req.body));
    }
    catch (err) {
        console.error(`Error while updating to-do/ note`, err.message);
        next(err);
    }
});
exports.patchToDo = patchToDo;
const removeToDo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(yield (0, exports.removeToDo)(req.params.id));
    }
    catch (err) {
        console.error(`Error while deleting to-do/ note`, err.message);
        next(err);
    }
});
exports.removeToDo = removeToDo;
