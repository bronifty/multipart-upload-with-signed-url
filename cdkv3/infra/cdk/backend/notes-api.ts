import {
  aws_dynamodb as dynamodb,
  aws_lambda_nodejs as lambda,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface NotesApiProps {
  /** the dynamodb table to be passed to lambda function **/
  table: dynamodb.Table;
  /** the actions which should be granted on the table */
  grantActions: string[];
  entry: string; // accepts .js, .jsx, .cjs, .mjs, .ts, .tsx, .cts and .mts files
  handler: string; // defaults to 'handler'
}

export class NotesApi extends Construct {
  /** allows accessing the counter function */
  public readonly handler: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props: NotesApiProps) {
    super(scope, id);

    const { table, grantActions, entry, handler } = props;

    // Create an IAM role for the Lambda function
    const lambdaRole = new iam.Role(this, `${id}-lambda-role`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Role for Lambda to access DynamoDB",
    });

    // Attach permissions to the role
    const policy = new iam.PolicyStatement({
      actions: grantActions,
      resources: [table.tableArn],
    });
    lambdaRole.addToPolicy(policy);

    // Create the Lambda function and attach the role
    this.handler = new lambda.NodejsFunction(this, id, {
      entry,
      handler,
      environment: { NOTES_TABLE_NAME: table.tableName },
      role: lambdaRole, // Associate the role with the Lambda
    });
  }
}

// import { aws_dynamodb as dynamodb, aws_lambda_nodejs as lambda } from "aws-cdk-lib";
// import { Construct } from "constructs";

// export interface NotesApiProps {
//   /** the dynamodb table to be passed to lambda function **/
//   table: dynamodb.Table;
//   /** the actions which should be granted on the table */
//   grantActions: string[];
// }

// export class NotesApi extends Construct {
//   /** allows accessing the counter function */
//   public readonly handler: lambda.NodejsFunction;

//   constructor(scope: Construct, id: string, props: NotesApiProps) {
//     super(scope, id);

//     const { table, grantActions } = props;

//     this.handler = new lambda.NodejsFunction(this, id, {
//       environment: { NOTES_TABLE_NAME: table.tableName },
//     });

//     // grant the lambda role read/write permissions to notes table
//     table.grant(this.handler, ...grantActions);
//   }
// }
