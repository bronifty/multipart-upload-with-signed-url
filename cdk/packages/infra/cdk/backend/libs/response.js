"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
const success = (body) => {
    return buildResponse(200, body);
};
exports.success = success;
const failure = (body) => {
    return buildResponse(500, body);
};
exports.failure = failure;
const buildResponse = (statusCode, body) => ({
    statusCode: statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
});
