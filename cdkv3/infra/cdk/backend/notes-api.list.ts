import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
<<<<<<< HEAD
import { success, failure } from "./libs/response";
=======
import { failure, success } from "./libs/response";
>>>>>>> origin/main

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  const params = {
<<<<<<< HEAD
    TableName: process.env.NOTES_TABLE_NAME || "",
  };

  try {
    const result = await client.send(new ScanCommand(params));
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
=======
    TableName: process.env.NOTES_TABLE_NAME,
  };
  try {
    const result = await client.send(new ScanCommand(params));
    return success(result.Items || []);
  } catch (error) {
    console.error(error);
    return failure({ status: false, error: "Failed to get notes" });
>>>>>>> origin/main
  }
};
