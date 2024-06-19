import {
  aws_dynamodb as dynamodb,
  aws_lambda_nodejs as lambda,
  aws_iam as iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface NotesApiProps {
  table: dynamodb.Table;
  grantActions: string[];
}

export class NotesApi extends Construct {
  public readonly handler: lambda.NodejsFunction;
  constructor(scope: Construct, id: string, props: NotesApiProps) {
    super(scope, id);
    const { table, grantActions } = props;

    const lambdaRole = new iam.Role(this, `${id}-lambda-role`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    const policy = new iam.PolicyStatement({
      actions: grantActions,
      resources: [table.tableArn],
      effect: iam.Effect.ALLOW,
    });
    lambdaRole.addToPolicy(policy);

    table;
    this.handler = new lambda.NodejsFunction(this, id, {
      environment: {
        NOTES_TABLE_NAME: table.tableName,
      },
      role: lambdaRole, // TODO: impl lambdaRole
    });
  }
}
