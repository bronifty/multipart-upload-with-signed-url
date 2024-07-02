import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { appDir, apiDir } from "./utils/fs";

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new cdk.aws_s3.Bucket(this, "bronifty-site-bucket-2");
    new cdk.aws_cloudfront.Distribution(this, "bronifty-site-distribution-2", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(myBucket),
      },
    });
  }
}
