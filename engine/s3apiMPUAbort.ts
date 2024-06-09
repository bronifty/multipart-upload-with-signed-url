import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

/**
 * Generic function to get AWS resource ARN by name.
 * @param {string} profileName - Name of the profile.
 * @param {string} bucketName - Name of the bucket.
 * @param {string} keyName - Name of the key.
 * @param {string} uploadId - ID of the upload.
 * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
 */

export async function abortMultipartUpload(
  profileName: string = "default",
  bucketName: string,
  keyName: string,
  uploadId: string
) {
  //   let command;
  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    "aws configure get region --output text"
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    "aws sts get-caller-identity --query Account --output text"
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();
  const command = `aws s3api abort-multipart-upload --profile ${profileName} --bucket ${bucketName} --key ${keyName} --upload-id ${uploadId}`;

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
async function main() {
  const { UploadId } = await abortMultipartUpload(
    "sst",
    "bronifty-sst",
    "multipart/01",
    "dfRtDYU0WWCCcH43C3WFbkRONycyCpTJJvxu2i5GYkZljF.Yxwh6XG7WfS2vC4to6HiV6Yjlx.cph0gtNBtJ8P3URCSbB7rjxI5iEwVDmgaXZOGgkk5nVTW16HOQ5l0R"
  );
  return UploadId;
}
main()
  .then((objects) => console.log("Objects:", objects))
  .catch((err) => console.error(err));
