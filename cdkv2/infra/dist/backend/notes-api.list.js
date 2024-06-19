"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("./libs/response");
const client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
const handler = async () => {
    const params = {
        TableName: process.env.NOTES_TABLE_NAME || "",
    };
    try {
        const result = await client.send(new lib_dynamodb_1.ScanCommand(params));
        // Return the matching list of items in response body
        return (0, response_1.success)(result.Items);
    }
    catch (e) {
        console.log(e);
        return (0, response_1.failure)({ status: false });
    }
};
exports.handler = handler;
