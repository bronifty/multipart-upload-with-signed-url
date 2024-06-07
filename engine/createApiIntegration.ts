import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

async function createApiIntegration(
  resourceName: string,
  functionName: string
) {
  try {
    // Retrieve the API ID
    const apiIdCommand = `aws apigatewayv2 get-apis --query "Items[?Name=='${resourceName}'].ApiId" --output json`;
    const apiIdResult = await execAsync(apiIdCommand);
    const API_ID = JSON.parse(apiIdResult.stdout.trim())[0];

    // Retrieve the AWS region
    const regionResult = await execAsync(
      "aws configure get region --output text"
    );
    const REGION = regionResult.stdout.trim();

    // Retrieve the AWS account ID
    const accountIdResult = await execAsync(
      "aws sts get-caller-identity --query Account --output text"
    );
    const ACCOUNT_ID = accountIdResult.stdout.trim();

    // Construct the integration URI
    const integrationUri = `arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${functionName}/invocations`;

    // Create the API integration
    const createIntegrationCommand = `aws apigatewayv2 create-integration --api-id ${API_ID} --integration-type AWS_PROXY --integration-method POST --integration-uri "${integrationUri}" --payload-format-version 2.0`;
    const integrationResult = await execAsync(createIntegrationCommand);
    console.log("Integration created successfully:", integrationResult.stdout);
  } catch (error) {
    console.error("Failed to create API integration:", error);
    throw error;
  }
}

// Example usage
createApiIntegration("apiName", "functionName")
  .then(() => console.log("API integration setup complete."))
  .catch((err) => console.error(err));
