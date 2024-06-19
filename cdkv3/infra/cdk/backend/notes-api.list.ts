import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { failure, success } from "./libs/response";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  const params = {
    TableName: process.env.NOTES_TABLE_NAME,
  };
  try {
    const result = await client.send(new ScanCommand(params));
    return success(result.Items || []);
  } catch (error) {
    console.error(error);
    return failure({ status: false, error: "Failed to get notes" });
  }
};
