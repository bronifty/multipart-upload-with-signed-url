"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("./libs/response");
const client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    const params = {
        TableName: process.env.NOTES_TABLE_NAME || "",
        // 'Key' defines the partition key and sort key of the item to be removed
        // - 'noteId': path parameter
        Key: { noteId: event.pathParameters?.id },
    };
    try {
        await client.send(new lib_dynamodb_1.DeleteCommand(params));
        return (0, response_1.success)({ status: true });
    }
    catch (e) {
        console.log(e);
        return (0, response_1.failure)({ status: false });
    }
};
exports.handler = handler;
