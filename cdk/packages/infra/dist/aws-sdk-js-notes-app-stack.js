"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsSdkJsNotesAppStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const notes_api_1 = require("./backend/notes-api");
class AwsSdkJsNotesAppStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new aws_cdk_lib_1.aws_dynamodb.Table(this, "notes", {
            partitionKey: { name: "noteId", type: aws_cdk_lib_1.aws_dynamodb.AttributeType.STRING },
        });
        const api = new aws_cdk_lib_1.aws_apigateway.RestApi(this, "endpoint");
        const notes = api.root.addResource("notes");
        notes.addMethod("GET", new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(new notes_api_1.NotesApi(this, "list", {
            table,
            grantActions: ["dynamodb:Scan"],
        }).handler));
        notes.addMethod("POST", new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(new notes_api_1.NotesApi(this, "create", {
            table,
            grantActions: ["dynamodb:PutItem"],
        }).handler));
        const note = notes.addResource("{id}", {
            defaultCorsPreflightOptions: {
                allowOrigins: aws_cdk_lib_1.aws_apigateway.Cors.ALL_ORIGINS,
            },
        });
        note.addMethod("GET", new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(new notes_api_1.NotesApi(this, "get", {
            table,
            grantActions: ["dynamodb:GetItem"],
        }).handler));
        note.addMethod("PUT", new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(new notes_api_1.NotesApi(this, "update", {
            table,
            grantActions: ["dynamodb:UpdateItem"],
        }).handler));
        note.addMethod("DELETE", new aws_cdk_lib_1.aws_apigateway.LambdaIntegration(new notes_api_1.NotesApi(this, "delete", {
            table,
            grantActions: ["dynamodb:DeleteItem"],
        }).handler));
        const filesBucket = new aws_cdk_lib_1.aws_s3.Bucket(this, "files-bucket");
        filesBucket.addCorsRule({
            allowedOrigins: aws_cdk_lib_1.aws_apigateway.Cors.ALL_ORIGINS, // NOT recommended for production code
            allowedMethods: [aws_cdk_lib_1.aws_s3.HttpMethods.PUT, aws_cdk_lib_1.aws_s3.HttpMethods.GET, aws_cdk_lib_1.aws_s3.HttpMethods.DELETE],
            allowedHeaders: ["*"],
        });
        const identityPool = new aws_cdk_lib_1.aws_cognito.CfnIdentityPool(this, "identity-pool", {
            allowUnauthenticatedIdentities: true,
        });
        const unauthenticated = new aws_cdk_lib_1.aws_iam.Role(this, "unauthenticated-role", {
            assumedBy: new aws_cdk_lib_1.aws_iam.FederatedPrincipal("cognito-identity.amazonaws.com", {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": identityPool.ref,
                },
                "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated",
                },
            }, "sts:AssumeRoleWithWebIdentity"),
        });
        // NOT recommended for production code - only give read permissions for unauthenticated resources
        // filesBucket.grantRead(unauthenticated);
        // filesBucket.grantPut(unauthenticated);
        // filesBucket.grantDelete(unauthenticated);
        const s3AccessPolicy = new aws_cdk_lib_1.aws_iam.PolicyStatement({
            actions: [
                "s3:GetObject", // For read access
                "s3:PutObject", // For put access
                "s3:DeleteObject", // For delete access
            ],
            resources: [filesBucket.arnForObjects("*")],
            effect: aws_cdk_lib_1.aws_iam.Effect.ALLOW,
        });
        unauthenticated.addToPolicy(s3AccessPolicy);
        // Add policy to start Transcribe stream transcription
        unauthenticated.addToPolicy(new aws_cdk_lib_1.aws_iam.PolicyStatement({
            resources: ["*"],
            actions: ["transcribe:StartStreamTranscriptionWebSocket"],
        }));
        // Add policy to enable Amazon Polly text-to-speech
        unauthenticated.addManagedPolicy(aws_cdk_lib_1.aws_iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonPollyFullAccess"));
        new aws_cdk_lib_1.aws_cognito.CfnIdentityPoolRoleAttachment(this, "role-attachment", {
            identityPoolId: identityPool.ref,
            roles: {
                unauthenticated: unauthenticated.roleArn,
            },
        });
        new aws_cdk_lib_1.CfnOutput(this, "FilesBucket", { value: filesBucket.bucketName });
        new aws_cdk_lib_1.CfnOutput(this, "GatewayUrl", { value: api.url });
        new aws_cdk_lib_1.CfnOutput(this, "IdentityPoolId", { value: identityPool.ref });
        new aws_cdk_lib_1.CfnOutput(this, "Region", { value: this.region });
    }
}
exports.AwsSdkJsNotesAppStack = AwsSdkJsNotesAppStack;
