import { exec } from "child_process";
import util from "util";
const execAsync = util.promisify(exec);
/**
 * Lists all multipart uploads and aborts each one.
 * @param {MPUType} config - Configuration object containing profile and bucket.
 */
async function listAndAbortMPU(config) {
    const { profile = "default", bucket, key, uploadId } = config;
    // List files in bucket
    const listCommand = `aws s3api list-objects --profile ${profile} --bucket ${bucket} --query 'Contents[].{Key: Key, Size: Size}'`;
    try {
        const listResult = await execAsync(listCommand);
        const listResponse = JSON.parse(listResult.stdout);
        if (!listResponse) {
            console.log("No files to delete.");
            return;
        }
        // Delete each file
        for (const file of listResponse) {
            const deleteCommand = `aws s3api delete-object --profile ${profile} --bucket ${bucket} --key ${file.Key}`;
            try {
                await execAsync(deleteCommand);
                console.log(`Deleted file: ${file.Key}`);
            }
            catch (deleteError) {
                console.error(`Error deleting file ${file.Key}: ${deleteError}`);
            }
        }
    }
    catch (listError) {
        console.error(`Error listing files: ${listError}`);
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
        console.log("All files have been deleted.");
    }
    catch (error) {
        console.error("Error in main function: ", error);
    }
}
main();
