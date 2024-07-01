"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
function handler(event) {
    return {
        statusCode: 200,
        statusDescription: "OK",
        headers: {
            "content-type": {
                value: "text/plain",
            },
        },
        body: "Hello, World!",
    };
}
exports.handler = handler;
