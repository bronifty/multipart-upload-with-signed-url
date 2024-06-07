import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

/**
 * Generic function to get AWS resource ARN by name.
 * @param {string} resourceType - Type of the resource ('api' or 'lambda').
 * @param {string} resourceName - Name of the resource.
 * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
 */

export async function getResourceArn(
  resourceType: "lambda" | "api",
  resourceName: string
) {
  let command;
  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    "aws configure get region --output text"
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    "aws sts get-caller-identity --query Account --output text"
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();

  switch (resourceType) {
    case "api":
      command = `aws apigatewayv2 get-apis --query "Items[?Name=='${resourceName}'].ApiId" --output json`;
      break;
    case "lambda":
      command = `aws lambda get-function --function-name ${resourceName} --query "Configuration.FunctionArn" --output json`;
      break;
    default:
      throw new Error('Unsupported resource type. Use "api" or "lambda".');
  }
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const resultArray = JSON.parse(stdout);
    if (resultArray.length === 0) {
      throw new Error("No results found.");
    }
    switch (resourceType) {
      case "api":
        return `arn:aws:apigateway:${REGION}::${ACCOUNT_ID}:/apis/${resultArray[0]}`;
      case "lambda":
        return resultArray;
      default:
        throw new Error('Unsupported resource type. Use "api" or "lambda".');
    }
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    throw error;
  }
}

// Example usage:
getResourceArn("lambda", "function")
  .then((arn) => console.log("Lambda ARN:", arn))
  .catch((err) => console.error(err));

getResourceArn("api", "api")
  .then((apiArn) => console.log("API ARN:", apiArn))
  .catch((err) => console.error(err));
