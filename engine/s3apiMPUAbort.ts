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
export async function mpuAbort(config: MPUType): Promise<MPUType> {
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
    const result = JSON.parse(stdout);
    if (!result) {
      throw new Error("No result found.");
    }
    return result;
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
    console.log("result in main: ", result);
  } catch (error) {
    console.error("Error in main: ", error);
  }
}
main();

// import { exec } from "child_process";
// import util from "util";
// import { MPUConfig } from "./types";

// const execAsync = util.promisify(exec);

// type MPUResponse = {
//   ServerSideEncryption: string;
//   Bucket: string;
//   Key: string;
//   UploadId: string;
// };

// /**
//  * Generic function to get AWS resource ARN by name.
//  * @param {MPUConfig} config - Configuration object containing profileName, bucketName, keyName, and uploadId.
//  * @returns {Promise<MPUResponse>} - A promise that resolves to the MPUResponse object.
//  */
// export async function mpuAbort(config: MPUConfig): Promise<MPUResponse> {
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

//   const command = `aws s3api abort-multipart-upload --profile ${profileName} --bucket ${bucketName} --key ${keyName} --upload-id ${uploadId}`;

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
//   const MPUResponse = await mpuAbort(config);
//   console.log("MPUReponse: ", MPUResponse);
//   return MPUResponse;
// }
// main()
//   .then((MPUResponse) =>
//     console.log("MPUReponse in main's then: ", MPUResponse)
//   )
//   .catch((err) => console.error("Error in catch: ", err));

// // import { exec } from "child_process";
// // import util from "util";

// // const execAsync = util.promisify(exec);

// // /**
// //  * Generic function to get AWS resource ARN by name.
// //  * @param {string} profileName - Name of the profile.
// //  * @param {string} bucketName - Name of the bucket.
// //  * @param {string} keyName - Name of the key.
// //  * @param {string} uploadId - ID of the upload.
// //  * @returns {Promise<string>} - A promise that resolves to the ARN of the resource.
// //  */

// // export async function abortMultipartUpload(
// //   profileName: string = "default",
// //   bucketName: string,
// //   keyName: string,
// //   uploadId: string
// // ) {
// //   //   let command;
// //   // Execute the command and extract the stdout, then trim any extra whitespace
// //   const regionResult = await execAsync(
// //     "aws configure get region --output text"
// //   );
// //   const REGION = regionResult.stdout.trim();
// //   const accountIdResult = await execAsync(
// //     "aws sts get-caller-identity --query Account --output text"
// //   );
// //   const ACCOUNT_ID = accountIdResult.stdout.trim();
// //   const command = `aws s3api abort-multipart-upload --profile ${profileName} --bucket ${bucketName} --key ${keyName} --upload-id ${uploadId}`;

// //   try {
// //     const { stdout, stderr } = await execAsync(command);
// //     if (stderr) {
// //       throw new Error(`Error fetching data: ${stderr}`);
// //     }
// //     const resultArray = JSON.parse(stdout);
// //     if (resultArray.length === 0) {
// //       throw new Error("No results found.");
// //     }
// //     return resultArray;
// //   } catch (error) {
// //     console.error(`Failed to execute command: ${error}`);
// //     throw error;
// //   }
// // }

// // // Example usage:
// // async function main() {
// //   const { UploadId } = await abortMultipartUpload(
// //     "sst",
// //     "bronifty-sst",
// //     "multipart/01",
// //     "dfRtDYU0WWCCcH43C3WFbkRONycyCpTJJvxu2i5GYkZljF.Yxwh6XG7WfS2vC4to6HiV6Yjlx.cph0gtNBtJ8P3URCSbB7rjxI5iEwVDmgaXZOGgkk5nVTW16HOQ5l0R"
// //   );
// //   return UploadId;
// // }
// // main()
// //   .then((objects) => console.log("Objects:", objects))
// //   .catch((err) => console.error(err));
