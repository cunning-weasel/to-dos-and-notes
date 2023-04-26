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
exports.login = void 0;
const encryption_1 = require("../models/encryption");
const db_1 = require("../models/db");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = req.body;
    const user = yield (0, db_1.getUserId)({ id });
    if (!user) {
        throw Error("incorrect username.");
    }
    try {
        const match = (0, encryption_1.comparePassword)(password, user.password);
        if (!match) {
            return res.status(403).json({
                message: "incorrect password.",
            });
        }
        return res.json({
            message: "User logged in successfully!",
        });
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.login = login;
