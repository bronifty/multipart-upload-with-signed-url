import * as cdk from "aws-cdk-lib";

const app = new cdk.App();

const stack = new cdk.Stack(app, "CloudFrontLambdaEdgeStack", {
  env: { region: "us-east-1" }, // Lambda@Edge functions must be created in us-east-1
  stackName: "CloudFrontLambdaEdgeStack",
  description: "Stack to create CloudFront distribution with Lambda@Edge",
});

// S3 bucket to host the website
const bucket = new cdk.aws_s3.Bucket(stack, "WebsiteBucket", {
  websiteIndexDocument: "index.html",
});

// Lambda@Edge function
const edgeFunction = new cdk.aws_lambda.Function(stack, "EdgeFunction", {
  runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
  handler: "index.handler",
  code: cdk.aws_lambda.Code.fromAsset("path/to/lambda/code"),
});

// CloudFront distribution
const distribution = new cdk.aws_cloudfront.Distribution(
  stack,
  "Distribution",
  {
    defaultBehavior: {
      origin: new cdk.aws_cloudfront_origins.S3Origin(bucket),
      edgeLambdas: [
        {
          functionVersion: edgeFunction.currentVersion,
          eventType: cdk.aws_cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
        },
      ],
    },
  }
);

new cdk.CfnOutput(stack, "DistributionDomainName", {
  value: distribution.distributionDomainName,
});

app.synth();
