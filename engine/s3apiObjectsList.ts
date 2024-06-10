import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

/**
 * Generic function to get AWS resource ARN by name.
 * @param {string} profile - Name of the profile.
 * @param {string} bucket - Name of the bucket.
 * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
 */

export async function listObjects(profile: string = "default", bucket: string) {
  // const { profile = "default", bucket, key, uploadId } = config;

  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    `aws configure --profile ${profile} get region --output text`
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    `aws sts --profile ${profile} get-caller-identity  --query Account --output text`
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();

  const command = `aws s3api list-objects --profile ${profile} --bucket ${bucket} --query 'Contents[].{Key: Key, Size: Size}'`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const resultArray = JSON.parse(stdout);
    if (resultArray.length === 0) {
      throw new Error("No results found.");
    }
    return resultArray;
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    throw error;
  }
}

// Example usage:

listObjects("sst", "bronifty-sst")
  .then((objects) => console.log("Objects:", objects))
  .catch((err) => console.error(err));
