import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { fromIni } from "@aws-sdk/credential-provider-ini";

function createLambdaClient(profile: string) {
  return new LambdaClient({
    credentials: fromIni({ profile }),
  });
}

export const listLambdas = async (profile: string = "default") => {
  const client = createLambdaClient(profile);

  try {
    const command = new ListFunctionsCommand({});
    const response = await client.send(command);

    console.log("Lambda functions:", response.Functions);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Functions),
    };
  } catch (error) {
    console.error("Error listing Lambda functions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to list Lambda functions" }),
    };
  }
};

listLambdas().catch(console.error);
