import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);
/**
 * Lists all multipart uploads and aborts each one.
 * @param {MPUType} config - Configuration object containing profile and bucket.
 */
async function listAndAbortMPU(config) {
    const { profile = "default", bucket, key, uploadId } = config;
    // List multipart uploads
    const listCommand = `aws s3api list-multipart-uploads --profile ${profile} --bucket ${bucket}`;
    try {
        const listResult = await execAsync(listCommand);
        const listResponse = JSON.parse(listResult.stdout);
        if (!listResponse.Uploads) {
            console.log("No uploads to abort.");
            return;
        }
        // Abort each multipart upload
        for (const upload of listResponse.Uploads) {
            const abortCommand = `aws s3api abort-multipart-upload --profile ${profile} --bucket ${bucket} --key "${upload.Key}" --upload-id "${upload.UploadId}"`;
            try {
                await execAsync(abortCommand);
                console.log(`Aborted upload: ${upload.UploadId} for key: ${upload.Key}`);
            }
            catch (abortError) {
                console.error(`Error aborting upload ${upload.UploadId}: ${abortError}`);
            }
        }
    }
    catch (listError) {
        console.error(`Error listing uploads: ${listError}`);
        throw listError;
    }
}
// Example usage:
async function main() {
    const config = {
        profile: "sst",
        bucket: "bronifty-sst",
        key: "",
        uploadId: "",
    };
    try {
        await listAndAbortMPU(config);
        console.log("All listed multipart uploads have been aborted.");
    }
    catch (error) {
        console.error("Error in main function: ", error);
    }
}
main();
