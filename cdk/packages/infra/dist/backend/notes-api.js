"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesApi = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const constructs_1 = require("constructs");
class NotesApi extends constructs_1.Construct {
    /** allows accessing the counter function */
    handler;
    constructor(scope, id, props) {
        super(scope, id);
        const { table, grantActions } = props;
        // Create an IAM role for the Lambda function
        const lambdaRole = new aws_cdk_lib_1.aws_iam.Role(this, `${id}-lambda-role`, {
            assumedBy: new aws_cdk_lib_1.aws_iam.ServicePrincipal("lambda.amazonaws.com"),
            description: "Role for Lambda to access DynamoDB",
        });
        // Attach permissions to the role
        const policy = new aws_cdk_lib_1.aws_iam.PolicyStatement({
            actions: grantActions,
            resources: [table.tableArn],
        });
        lambdaRole.addToPolicy(policy);
        // Create the Lambda function and attach the role
        this.handler = new aws_cdk_lib_1.aws_lambda_nodejs.NodejsFunction(this, id, {
            environment: { NOTES_TABLE_NAME: table.tableName },
            role: lambdaRole, // Associate the role with the Lambda
        });
    }
}
exports.NotesApi = NotesApi;
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
