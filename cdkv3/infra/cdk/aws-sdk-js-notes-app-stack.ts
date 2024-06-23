import {
  Stack,
  StackProps,
  CfnOutput,
  aws_apigateway as apigw,
  aws_cognito as cognito,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_s3 as s3,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { NotesApi } from "./backend/notes-api";
import { cjsDir } from "./backend/libs/fs";

export class AwsSdkJsNotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "notes", {
      partitionKey: { name: "noteId", type: dynamodb.AttributeType.STRING },
    });

    const api = new apigw.RestApi(this, "endpoint");
    const notes = api.root.addResource("notes");
    notes.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "list", {
          table,
          grantActions: ["dynamodb:Scan"],
          entry: cjsDir("../notes-api.list.js"),
          handler: "handler",
        }).handler
      )
    );
    notes.addMethod(
      "POST",
      new apigw.LambdaIntegration(
        new NotesApi(this, "create", {
          table,
          grantActions: ["dynamodb:PutItem"],
          entry: cjsDir("../notes-api.create.js"),
          handler: "handler",
        }).handler
      )
    );

    const note = notes.addResource("{id}", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
      },
    });
    note.addMethod(
      "GET",
      new apigw.LambdaIntegration(
        new NotesApi(this, "get", {
          table,
          grantActions: ["dynamodb:GetItem"],
          entry: cjsDir("../notes-api.get.js"),
          handler: "handler",
        }).handler
      )
    );
    note.addMethod(
      "PUT",
      new apigw.LambdaIntegration(
        new NotesApi(this, "update", {
          table,
          grantActions: ["dynamodb:UpdateItem"],
          entry: cjsDir("../notes-api.update.js"),
          handler: "handler",
        }).handler
      )
    );
    note.addMethod(
      "DELETE",
      new apigw.LambdaIntegration(
        new NotesApi(this, "delete", {
          table,
          grantActions: ["dynamodb:DeleteItem"],
          entry: cjsDir("../notes-api.delete.js"),
          handler: "handler",
        }).handler
      )
    );

    const filesBucket = new s3.Bucket(this, "files-bucket");
    filesBucket.addCorsRule({
      allowedOrigins: apigw.Cors.ALL_ORIGINS, // NOT recommended for production code
      allowedMethods: [
        s3.HttpMethods.PUT,
        s3.HttpMethods.GET,
        s3.HttpMethods.DELETE,
      ],
      allowedHeaders: ["*"],
    });

    const identityPool = new cognito.CfnIdentityPool(this, "identity-pool", {
      allowUnauthenticatedIdentities: true,
    });

    const unauthenticated = new iam.Role(this, "unauthenticated-role", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    // NOT recommended for production code - only give read permissions for unauthenticated resources
    // filesBucket.grantRead(unauthenticated);
    // filesBucket.grantPut(unauthenticated);
    // filesBucket.grantDelete(unauthenticated);

    const s3AccessPolicy = new iam.PolicyStatement({
      actions: [
        "s3:GetObject", // For read access
        "s3:PutObject", // For put access
        "s3:DeleteObject", // For delete access
      ],
      resources: [filesBucket.arnForObjects("*")],
      effect: iam.Effect.ALLOW,
    });

    unauthenticated.addToPolicy(s3AccessPolicy);

    // Add policy to start Transcribe stream transcription
    unauthenticated.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: ["transcribe:StartStreamTranscriptionWebSocket"],
      })
    );

    // Add policy to enable Amazon Polly text-to-speech
    unauthenticated.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonPollyFullAccess")
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "role-attachment", {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: unauthenticated.roleArn,
      },
    });

    new CfnOutput(this, "FilesBucket", { value: filesBucket.bucketName });
    new CfnOutput(this, "GatewayUrl", { value: api.url });
    new CfnOutput(this, "IdentityPoolId", { value: identityPool.ref });
    new CfnOutput(this, "Region", { value: this.region });
  }
}
