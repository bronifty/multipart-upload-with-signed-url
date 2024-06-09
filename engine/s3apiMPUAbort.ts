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

type MPUResponse = {
  UploadId: string;
  Key: string;
  Initiated: string;
  StorageClass: string;
  Owner: {
    ID: string;
  };
};

/**
 * Generic function to get AWS resource ARN by name.
 * @param {MPUType} config - Configuration object containing profile, bucket, keyName, and uploadId.
 * @returns void
 */
export async function mpuAbort(config: MPUType): Promise<void> {
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

  const command = `aws s3api abort-multipart-upload --profile ${profile} --bucket ${bucket} --key ${key} --upload-id ${uploadId}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    // const result = JSON.parse(stdout);
    // if (!result) {
    //   throw new Error("No result found.");
    // }
    // return result;
    // const mpuType: MPUType = {
    //   profile,
    //   bucket,
    //   key: result.Key,
    //   uploadId: result.UploadId,
    // };
    // return mpuType;
    // const mpuTypes: MPUType[] = result.Uploads.map((upload) => ({
    //   profile,
    //   bucket,
    //   key: upload.Key,
    //   uploadId: upload.UploadId,
    // }));
    // return mpuTypes;
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
    key: "multipart/02",
    uploadId:
      "_z0fahejuKxJvy2Oowcn.QgXmKJmfOXiXTn.fqTC14Q_L6LPJ7ODDUwpd.7_kQYER2jmbsL6uIrc.uM0FSB0Um2mHk6bCTNyQcGGKbHqdcVM5.27FNxNpeKZ6_InLXp0",
  };
  try {
    const result = await mpuAbort(config);
    // result.forEach((mpu) => {
    //   console.log(mpu);
    // });
    // console.log("result in main: ", result);
  } catch (error) {
    console.error("Error in main: ", error);
  }
}
main();
