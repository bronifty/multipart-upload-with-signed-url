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
import { getSuffixFromStack } from "./utils/suffix";

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const table = new cdk.aws_dynamodb.Table(this, `table-${suffix}`, {
      partitionKey: { name: "id", type: cdk.aws_dynamodb.AttributeType.STRING },
      billingMode: cdk.aws_dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ... existing code ...

    const siteBucketParameter = new CfnParameter(
      this,
      `site-bucket-name-${suffix}`,
      {
        type: "String",
        description: "The name of S3 bucket to upload react application",
      }
    );

    const siteBucket = new s3.Bucket(this, `site-bucket-id-${suffix}`, {
      bucketName: siteBucketParameter.valueAsString,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    new CfnOutput(this, `site-bucket-${suffix}`, {
      value: siteBucket.bucketName,
    });

    new s3deploy.BucketDeployment(this, `site-bucket-deployment-${suffix}`, {
      sources: [s3deploy.Source.asset(appDir())],
      destinationBucket: siteBucket,
    });

    const ssrEdgeFunction = new cloudfront.experimental.EdgeFunction(
      this,
      `ssr-edge-function-${suffix}`,
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
      `cloudfront-function-${suffix}`,
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

    const distribution = new cloudfront.Distribution(
      this,
      `ssr-cdn-${suffix}`,
      {
        defaultBehavior: {
          origin: new origins.S3Origin(siteBucket),
          functionAssociations: [
            {
              function: cloudfrontFunction,
              eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            },
          ],
        },
        additionalBehaviors: {
          "/ssr": {
            origin: new origins.S3Origin(siteBucket),
            edgeLambdas: [
              {
                functionVersion: ssrEdgeFunction.currentVersion,
                eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
              },
            ],
          },
        },
      }
    );

    new CfnOutput(this, `cf-url-${suffix}`, {
      value: `https://${distribution.distributionDomainName}`,
    });
    new CfnOutput(this, `lambda-edge-ssr-url-${suffix}`, {
      value: `https://${distribution.distributionDomainName}/ssr`,
    });
  }
}

// import {
//   Stack,
//   StackProps,
//   CfnOutput,
//   aws_apigateway as apigw,
//   aws_cognito as cognito,
//   aws_dynamodb as dynamodb,
//   aws_iam as iam,
//   aws_s3 as s3,
// } from "aws-cdk-lib";
// import { Construct } from "constructs";
// import { NotesApi } from "./backend/notes-api";
// import { cjsDir } from "./backend/libs/fs";

// export class AwsSdkJsNotesAppStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     const table = new dynamodb.Table(this, "notes", {
//       partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
//     });

//     const api = new apigw.RestApi(this, "endpoint");
//     const notes = api.root.addResource("notes");
//     notes.addMethod(
//       "GET",
//       new apigw.LambdaIntegration(
//         new NotesApi(this, "list", {
//           table,
//           grantActions: ["dynamodb:Scan"],
//           entry: cjsDir("../notes-api.list.js"),
//           handler: "handler",
//         }).handler
//       )
//     );
//     notes.addMethod(
//       "POST",
//       new apigw.LambdaIntegration(
//         new NotesApi(this, "create", {
//           table,
//           grantActions: ["dynamodb:PutItem"],
//           entry: cjsDir("../notes-api.create.js"),
//           handler: "handler",
//         }).handler
//       )
//     );

//     const note = notes.addResource("{id}", {
//       defaultCorsPreflightOptions: {
//         allowOrigins: apigw.Cors.ALL_ORIGINS,
//       },
//     });
//     note.addMethod(
//       "GET",
//       new apigw.LambdaIntegration(
//         new NotesApi(this, "get", {
//           table,
//           grantActions: ["dynamodb:GetItem"],
//           entry: cjsDir("../notes-api.get.js"),
//           handler: "handler",
//         }).handler
//       )
//     );
//     note.addMethod(
//       "PUT",
//       new apigw.LambdaIntegration(
//         new NotesApi(this, "update", {
//           table,
//           grantActions: ["dynamodb:UpdateItem"],
//           entry: cjsDir("../notes-api.update.js"),
//           handler: "handler",
//         }).handler
//       )
//     );
//     note.addMethod(
//       "DELETE",
//       new apigw.LambdaIntegration(
//         new NotesApi(this, "delete", {
//           table,
//           grantActions: ["dynamodb:DeleteItem"],
//           entry: cjsDir("../notes-api.delete.js"),
//           handler: "handler",
//         }).handler
//       )
//     );

//     const filesBucket = new s3.Bucket(this, "files-bucket");
//     filesBucket.addCorsRule({
//       allowedOrigins: apigw.Cors.ALL_ORIGINS, // NOT recommended for production code
//       allowedMethods: [
//         s3.HttpMethods.PUT,
//         s3.HttpMethods.GET,
//         s3.HttpMethods.DELETE,
//       ],
//       allowedHeaders: ["*"],
//     });

//     const identityPool = new cognito.CfnIdentityPool(this, "identity-pool", {
//       allowUnauthenticatedIdentities: true,
//     });

//     const unauthenticated = new iam.Role(this, "unauthenticated-role", {
//       assumedBy: new iam.FederatedPrincipal(
//         "cognito-identity.amazonaws.com",
//         {
//           StringEquals: {
//             "cognito-identity.amazonaws.com:aud": identityPool.ref,
//           },
//           "ForAnyValue:StringLike": {
//             "cognito-identity.amazonaws.com:amr": "unauthenticated",
//           },
//         },
//         "sts:AssumeRoleWithWebIdentity"
//       ),
//     });

//     // NOT recommended for production code - only give read permissions for unauthenticated resources
//     // filesBucket.grantRead(unauthenticated);
//     // filesBucket.grantPut(unauthenticated);
//     // filesBucket.grantDelete(unauthenticated);

//     const s3AccessPolicy = new iam.PolicyStatement({
//       actions: [
//         "s3:GetObject", // For read access
//         "s3:PutObject", // For put access
//         "s3:DeleteObject", // For delete access
//       ],
//       resources: [filesBucket.arnForObjects("*")],
//       effect: iam.Effect.ALLOW,
//     });

//     unauthenticated.addToPolicy(s3AccessPolicy);

//     // Add policy to start Transcribe stream transcription
//     unauthenticated.addToPolicy(
//       new iam.PolicyStatement({
//         resources: ["*"],
//         actions: ["transcribe:StartStreamTranscriptionWebSocket"],
//       })
//     );

//     // Add policy to enable Amazon Polly text-to-speech
//     unauthenticated.addManagedPolicy(
//       iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonPollyFullAccess")
//     );

//     new cognito.CfnIdentityPoolRoleAttachment(this, "role-attachment", {
//       identityPoolId: identityPool.ref,
//       roles: {
//         unauthenticated: unauthenticated.roleArn,
//       },
//     });

//     new CfnOutput(this, "FilesBucket", { value: filesBucket.bucketName });
//     new CfnOutput(this, "GatewayUrl", { value: api.url });
//     new CfnOutput(this, "IdentityPoolId", { value: identityPool.ref });
//     new CfnOutput(this, "Region", { value: this.region });
//   }
// }
