import { exec } from "child_process";
import util from "util";
import { MPUConfig } from "./types";

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
 * @param {MPUConfig} config - Configuration object containing profileName, bucketName, keyName, and uploadId.
 * @returns {Promise<MPUListResponse>} - A promise that resolves to the MPUListResponse object.
 */
export async function mpuCreate(config: MPUConfig): Promise<MPUListResponse> {
  const { profileName = "default", bucketName, keyName, uploadId } = config;

  // Execute the command and extract the stdout, then trim any extra whitespace
  const regionResult = await execAsync(
    `aws configure --profile ${profileName} get region --output text`
  );
  const REGION = regionResult.stdout.trim();
  const accountIdResult = await execAsync(
    `aws sts --profile ${profileName} get-caller-identity  --query Account --output text`
  );
  const ACCOUNT_ID = accountIdResult.stdout.trim();

  const command = `aws s3api list-multipart-uploads --profile ${profileName} --bucket ${bucketName}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const result: MPUListResponse = JSON.parse(stdout);
    if (!result) {
      throw new Error("No result found.");
    }
    return result;
  } catch (error) {
    console.error(`Failed to execute command: ${error}`);
    throw error;
  }
}

// Example usage:
async function main() {
  const config: MPUConfig = {
    profileName: "sst",
    bucketName: "bronifty-sst",
    keyName: "multipart/01",
    uploadId: "",
  };

  const result = await mpuCreate(config);
  const uploadsData: { UploadId: string; Key: string }[] = [];

  const uploads = result.Uploads;
  if (uploads && Array.isArray(uploads)) {
    uploads.forEach((upload) => {
      const { UploadId, Key } = upload;
      if (UploadId && Key) {
        uploadsData.push({ UploadId, Key });
      }
    });
  }
  console.log(uploadsData);
}
main()
  .then((MPUResponse) =>
    console.log("MPUReponse in main's then: ", MPUResponse)
  )
  .catch((err) => console.error("Error in catch: ", err));
