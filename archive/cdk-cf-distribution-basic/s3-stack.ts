import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new cdk.aws_s3.Bucket(this, "bronifty-site-bucket-2");

    new cdk.aws_s3_deployment.BucketDeployment(this, "DeployWebsite", {
      sources: [cdk.aws_s3_deployment.Source.asset("./app")],
      destinationBucket: myBucket,
    });

    new cdk.aws_cloudfront.Distribution(this, "bronifty-site-distribution-2", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(myBucket),
      },
    });
  }
}

// const app = new cdk.App();

// new AppStack(app, "AppStack", {
//   env: { region: "us-east-1" },
//   description: "App Stack",
// });
