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
const todos_1 = __importDefault(require("../models/todos"));
function get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield todos_1.default.getMultiple(req.query.page));
        }
        catch (err) {
            console.error(`Error while getting to-do/ notes`, err.message);
            next(err);
        }
    });
}
function post(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield todos_1.default.post(req.body));
        }
        catch (err) {
            console.error(`Error while creating to-do/ note`, err.message);
            next(err);
        }
    });
}
function put(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield todos_1.default.put(req.params.id, req.body));
        }
        catch (err) {
            console.error(`Error while updating to-do/ note`, err.message);
            next(err);
        }
    });
}
function remove(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield todos_1.default.remove(req.params.id));
        }
        catch (err) {
            console.error(`Error while deleting to-do/ note`, err.message);
            next(err);
        }
    });
}
exports.default = { get, post, put, remove };
