// Import required AWS SDK clients and commands for Node.js
const {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Set the AWS Region
const REGION = "us-west-2"; // e.g., "us-east-1"
// Create an S3 client service object
const s3Client = new S3Client({ region: REGION });

// Bucket name from which you want to delete objects
const bucketName = "your-bucket-name";

async function deleteAllObjects() {
  try {
    // List all objects in the bucket
    const listParams = {
      Bucket: bucketName,
    };

    let continuationToken;
    do {
      const data = await s3Client.send(new ListObjectsV2Command(listParams));
      continuationToken = data.NextContinuationToken;
      listParams.ContinuationToken = continuationToken;

      // Delete each object returned by the list operation
      for (let object of data.Contents) {
        const deleteParams = {
          Bucket: bucketName,
          Key: object.Key,
        };
        await s3Client.send(new DeleteObjectCommand(deleteParams));
        console.log(`Deleted ${object.Key}`);
      }
    } while (continuationToken);

    console.log("All objects deleted successfully.");
  } catch (err) {
    console.log("Error", err);
  }
}

deleteAllObjects();
