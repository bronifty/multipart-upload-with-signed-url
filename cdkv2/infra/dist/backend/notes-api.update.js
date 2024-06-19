"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const response_1 = require("./libs/response");
const client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
const handler = async (event) => {
    const data = JSON.parse(event.body || "{}");
    const params = {
        TableName: process.env.NOTES_TABLE_NAME || "",
        // 'Key' defines the partition key and sort key of the item to be updated
        // - 'noteId': path parameter
        Key: { noteId: event.pathParameters?.id },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content",
        ExpressionAttributeValues: { ":content": data.content },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: client_dynamodb_1.ReturnValue.ALL_NEW,
    };
    try {
        await client.send(new lib_dynamodb_1.UpdateCommand(params));
        return (0, response_1.success)({ status: true });
    }
    catch (e) {
        console.log(e);
        return (0, response_1.failure)({ status: false });
    }
};
exports.handler = handler;
