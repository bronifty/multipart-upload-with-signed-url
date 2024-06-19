"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const crypto_1 = __importDefault(require("crypto"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("./libs/response");
const client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    const data = JSON.parse(event.body || "{}");
    const params = {
        TableName: process.env.NOTES_TABLE_NAME || "",
        Item: {
            noteId: crypto_1.default.randomBytes(20).toString("hex"),
            content: data.content,
            createdAt: Date.now().toString(),
            ...(data.attachment && { attachment: data.attachment }),
        },
    };
    try {
        await client.send(new lib_dynamodb_1.PutCommand(params));
        return (0, response_1.success)(params.Item);
    }
    catch (e) {
        console.log(e);
        return (0, response_1.failure)({ status: false });
    }
};
exports.handler = handler;
