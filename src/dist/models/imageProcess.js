"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffi_napi_1 = __importDefault(require("ffi-napi"));
const image_processing_lib = ffi_napi_1.default.Library("./modules/image_processing_lib.so", {
// check if image exists first
// load the image && display
// ...
});
