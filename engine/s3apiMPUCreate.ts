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
 * @returns {Promise<MPUType>} - A promise that resolves to the MPUListResponse object.
 */
export async function mpuCreate(config: MPUType): Promise<MPUType> {
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

  const command = `aws s3api create-multipart-upload --profile ${profile} --bucket ${bucket} --key ${key}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      throw new Error(`Error fetching data: ${stderr}`);
    }
    const result: MPUResponse = JSON.parse(stdout);
    if (!result) {
      throw new Error("No result found.");
    }
    const mpuType: MPUType = {
      profile,
      bucket,
      key: result.Key,
      uploadId: result.UploadId,
    };
    return mpuType;
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
    uploadId: "",
  };
  try {
    const result = await mpuCreate(config);
    // result.forEach((mpu) => {
    //   console.log(mpu);
    // });
    console.log("MPUReponse in main's then: ", result);
  } catch (error) {
    console.error("Error in main: ", error);
  }
}
main();

// import { exec } from "child_process";
// import util from "util";
// import { MPUConfig, MPUResponse } from "./types";

// const execAsync = util.promisify(exec);

// /**
//  * Generic function to get AWS resource ARN by name.
//  * @param {MPUConfig} config - Configuration object containing profileName, bucketName, keyName, and uploadId.
//  * @returns {Promise<MPUResponse>} - A promise that resolves to the MPUResponse object.
//  */
// export async function mpuCreate(config: MPUConfig): Promise<MPUResponse> {
//   const { profileName = "default", bucketName, keyName, uploadId } = config;

//   // Execute the command and extract the stdout, then trim any extra whitespace
//   const regionResult = await execAsync(
//     `aws configure --profile ${profileName} get region --output text`
//   );
//   const REGION = regionResult.stdout.trim();
//   const accountIdResult = await execAsync(
//     `aws sts --profile ${profileName} get-caller-identity  --query Account --output text`
//   );
//   const ACCOUNT_ID = accountIdResult.stdout.trim();

//   const command = `aws s3api create-multipart-upload --profile ${profileName} --bucket ${bucketName} --key '${keyName}'`;

//   try {
//     const { stdout, stderr } = await execAsync(command);
//     if (stderr) {
//       throw new Error(`Error fetching data: ${stderr}`);
//     }
//     const result: MPUResponse = JSON.parse(stdout);
//     if (!result.UploadId) {
//       throw new Error("No UploadId found.");
//     }
//     return result;
//   } catch (error) {
//     console.error(`Failed to execute command: ${error}`);
//     throw error;
//   }
// }

// // Example usage:
// async function main() {
//   const config: MPUConfig = {
//     profileName: "sst",
//     bucketName: "bronifty-sst",
//     keyName: "multipart/01",
//     uploadId: "",
//   };
//   const MPUResponse = await mpuCreate(config);
//   console.log("MPUReponse: ", MPUResponse);
//   return MPUResponse;
// }
// main()
//   .then((MPUResponse) =>
//     console.log("MPUReponse in main's then: ", MPUResponse)
//   )
//   .catch((err) => console.error("Error in catch: ", err));
