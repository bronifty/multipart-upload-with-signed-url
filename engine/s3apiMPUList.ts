import { exec } from "child_process";
import util from "util";
import { MPUType } from "./types";

const execAsync = util.promisify(exec);

type MPUListResponse = {
  Uploads: [
    {
      UploadId: string;
      Key: string;
      Initiated: string;
      StorageClass: string;
      Owner: {
        ID: string;
      };
      Initiator: {
        ID: string;
      };
    }
  ];
  RequestCharged: null;
};

/**
 * Generic function to get AWS resource ARN by name.
 * @param {MPUType} config - Configuration object containing profile, bucket, keyName, and uploadId.
 * @returns {Promise<MPUType[]>} - A promise that resolves to the MPUListResponse object.
 */
export async function mpuList(config: MPUType): Promise<MPUType[]> {
  const { profile = "default", bucket, key, uploadId } = config;

  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    `aws configure --profile ${profile} get region --output text`
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    `aws sts --profile ${profile} get-caller-identity  --query Account --output text`
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();

  const command = `aws s3api list-multipart-uploads --profile ${profile} --bucket ${bucket}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const result: MPUListResponse = JSON.parse(stdout);
    if (!result) {
      throw new Error("No result found.");
    }
    const mpuTypes: MPUType[] = result.Uploads.map((upload) => ({
      profile,
      bucket,
      key: upload.Key,
      uploadId: upload.UploadId,
    }));
    return mpuTypes;
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    throw error;
  }
}

// Example usage:
async function main() {
  const config: MPUType = {
    profile: "sst",
    bucket: "bronifty-sst",
    key: "multipart/01",
    uploadId: "",
  };
  try {
    const result = await mpuList(config);
    result.forEach((mpu) => {
      console.log(mpu);
    });
  } catch (error) {
    console.error("Error in main: ", error);
  }
}
main();
