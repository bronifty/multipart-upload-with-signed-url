import {
  Duration,
  CfnOutput,
  CfnParameter,
  Stack,
  StackProps,
  RemovalPolicy,
} from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { appDir, apiDir } from "./utils/fs";

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new cdk.aws_dynamodb.Table(this, `bronifty-table`, {
      partitionKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ... existing code ...

    const siteBucketName = this.node.tryGetContext("bronifty-site-bucket-name");

    const siteBucket = new s3.Bucket(this, `site-bucket-id`, {
      bucketName: siteBucketName,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Grant CloudFront access to the S3 bucket
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI"
    );
    siteBucket.grantRead(originAccessIdentity);

    new CfnOutput(this, `site-bucket`, {
      value: siteBucket.bucketName,
    });

    new s3deploy.BucketDeployment(this, `site-bucket-deployment`, {
      sources: [s3deploy.Source.asset(appDir())],
      destinationBucket: siteBucket,
    });

    const ssrEdgeFunction = new cloudfront.experimental.EdgeFunction(
      this,
      `ssr-edge-function`,
      {
        runtime: lambda.Runtime.NODEJS_LATEST,
        handler: "index.handler",
        code: lambda.Code.fromAsset(apiDir()),
        memorySize: 128,
        timeout: Duration.seconds(5),
      }
    );

    const cloudfrontFunction = new cloudfront.Function(
      this,
      `cloudfront-function`,
      {
        code: cloudfront.FunctionCode.fromInline(`
          function handler(event) {
            var request = event.request;
            var uri = request.uri;
            
            if (uri.startsWith('/ssr')) {
              request.uri = '/ssr';
            }
            
            return request;
          }
        `),
      }
    );

    const distribution = new cloudfront.Distribution(this, `ssr-cdn`, {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        functionAssociations: [
          {
            function: cloudfrontFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        "/ssr": {
          origin: new origins.S3Origin(siteBucket, {
            originAccessIdentity: originAccessIdentity,
          }),
          edgeLambdas: [
            {
              functionVersion: ssrEdgeFunction.currentVersion,
              eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            },
          ],
        },
      },
    });

    new CfnOutput(this, `cf-url`, {
      value: `https://${distribution.distributionDomainName}`,
    });
    new CfnOutput(this, `lambda-edge-ssr-url`, {
      value: `https://${distribution.distributionDomainName}/ssr`,
    });
  }
}
