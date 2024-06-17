import { S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-provider-ini";

function createS3Client(profile: string): S3Client {
  return new S3Client({
    credentials: fromIni({ profile }),
  });
}

export { createS3Client };
