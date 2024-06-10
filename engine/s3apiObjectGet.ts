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
export async function s3apiObjectGet(config: MPUType): Promise<void> {
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

  const command = `aws s3api get-object --profile ${profile} --bucket ${bucket} --key ${key} ${key}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    return;
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
    key: "Archive.zip",
    uploadId: "",
  };
  try {
    const result = await s3apiObjectGet(config);
    // result.forEach((mpu) => {
    //   console.log(mpu);
    // });
    console.log("result in main: ", result);
  } catch (error) {
    console.error("Error in main: ", error);
  }
}
main();

// import { exec } from "child_process";
// import util from "util";
// import { existsSync, mkdirSync } from "fs";
// const execAsync = util.promisify(exec);

// /**
//  * Generic function to get AWS resource ARN by name.
//  * @param {string} profileName - Name of the profile.
//  * @param {string} bucketName - Name of the bucket.
//  * @param {string} keyName - Name of the key.
//  * @param {string} localFileName - Name of the local file.
//  * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
//  */

// export async function getObject(
//   profileName: string = "default",
//   bucketName: string,
//   keyName: string,
//   localFileName: string
// ) {
//   // const { profile = "default", bucket, key, uploadId } = config;

//   // Execute the command and extract the stdout, then trim any extra whitespace
//   const regionResult = await execAsync(
//     `aws configure --profile ${profile} get region --output text`
//   );
//   const REGION = regionResult.stdout.trim();
//   const accountIdResult = await execAsync(
//     `aws sts --profile ${profile} get-caller-identity  --query Account --output text`
//   );
//   const ACCOUNT_ID = accountIdResult.stdout.trim();

//   const command = `aws s3api get-object --profile ${profileName} --bucket ${bucketName} --key ${keyName} ${localFileName}`;

//   try {
//     const { stdout, stderr } = await execAsync(command);
//     if (stderr) {
//       throw new Error(`Error fetching data: ${stderr}`);
//     }
//     const resultArray = JSON.parse(stdout);
//     if (resultArray.length === 0) {
//       throw new Error("No results found.");
//     }
//     return resultArray;
//   } catch (error) {
//     console.error(`Failed to execute command: ${error}`);
//     throw error;
//   }
// }

// // Example usage:

// // Check if the './data' directory exists, if not create it
// if (!existsSync("./data")) {
//   mkdirSync("./data");
// }

// getObject(
//   "sst",
//   "bronifty-sst",
//   "mpuArchive01.zip",
//   "./data/mpuArchive01_download.zip"
// )
//   .then((objects) => console.log("Objects:", objects))
//   .catch((err) => console.error(err));
