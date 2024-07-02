"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiDir = exports.appDir = void 0;
const path = require("path");
const appDir = (pathStr = "./") => {
    return path.resolve(`${__dirname}/../app/${pathStr}`);
};
exports.appDir = appDir;
const apiDir = (pathStr = "./") => {
    return path.resolve(`${__dirname}/../api/${pathStr}`);
};
exports.apiDir = apiDir;
