"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSdkJsNotesAppStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const s3deploy = __importStar(require("aws-cdk-lib/aws-s3-deployment"));
const cloudfront = __importStar(require("aws-cdk-lib/aws-cloudfront"));
const origins = __importStar(require("aws-cdk-lib/aws-cloudfront-origins"));
const lambda = __importStar(require("aws-cdk-lib/aws-lambda"));
const fs_1 = require("./utils/fs");
class AwsSdkJsNotesAppStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const mySiteBucketName = new aws_cdk_lib_1.CfnParameter(this, "bronifty-ssr-bucket", {
            type: "String",
            description: "The name of S3 bucket to upload react application",
        });
        const mySiteBucket = new s3.Bucket(this, "ssr-site", {
            bucketName: mySiteBucketName.valueAsString,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "error.html",
            publicReadAccess: false,
            removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
        });
        new aws_cdk_lib_1.CfnOutput(this, "Bucket", { value: mySiteBucket.bucketName });
        new s3deploy.BucketDeployment(this, "Client-side React app", {
            sources: [s3deploy.Source.asset((0, fs_1.appDir)())],
            destinationBucket: mySiteBucket,
        });
        const ssrEdgeFunction = new cloudfront.experimental.EdgeFunction(this, "ssrEdgeHandler", {
            runtime: lambda.Runtime.NODEJS_LATEST,
            handler: "index.handler",
            code: lambda.Code.fromAsset((0, fs_1.apiDir)()),
            memorySize: 128,
            timeout: aws_cdk_lib_1.Duration.seconds(5),
        });
        const cloudfrontFunction = new cloudfront.Function(this, "RoutingFunction", {
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
        });
        const distribution = new cloudfront.Distribution(this, "ssr-cdn", {
            defaultBehavior: {
                origin: new origins.S3Origin(mySiteBucket),
                functionAssociations: [
                    {
                        function: cloudfrontFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    },
                ],
            },
            additionalBehaviors: {
                "/ssr": {
                    origin: new origins.S3Origin(mySiteBucket),
                    edgeLambdas: [
                        {
                            functionVersion: ssrEdgeFunction.currentVersion,
                            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
                        },
                    ],
                },
            },
        });
        new aws_cdk_lib_1.CfnOutput(this, "CF URL", {
            value: `https://${distribution.distributionDomainName}`,
        });
        new aws_cdk_lib_1.CfnOutput(this, "Lambda@Edge SSR URL", {
            value: `https://${distribution.distributionDomainName}/ssr`,
        });
    }
}
exports.AwsSdkJsNotesAppStack = AwsSdkJsNotesAppStack;
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
