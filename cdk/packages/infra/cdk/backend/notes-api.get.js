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
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'noteId': path parameter
        Key: { noteId: event.pathParameters?.id },
    };
    try {
        const result = await client.send(new lib_dynamodb_1.GetCommand(params));
        if (result.Item) {
            // Return the retrieved item
            return (0, response_1.success)(result.Item);
        }
        else {
            return (0, response_1.failure)({ status: false, error: "Item not found." });
        }
    }
    catch (e) {
        console.log(e);
        return (0, response_1.failure)({ status: false });
    }
};
exports.handler = handler;
