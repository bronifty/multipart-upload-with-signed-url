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

export class AwsSdkJsNotesAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "notes", {
      partitionKey: {
        name: "noteId",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const api = new apigw.RestApi(this, "endpoint");
    const notes = api.root.addResource("notes");
    // notes.addMethod("GET", new apigw.LambdaIntegration(
    //   new NotesApi...
    // TODO: impl notes api
    // ));
  } // end of constructor
} // end of class
