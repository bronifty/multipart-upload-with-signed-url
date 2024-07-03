import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new cdk.aws_lambda.Function(this, "MyLambdaFunction", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: "index.handler",
      code: cdk.aws_lambda.Code.fromAsset("api"),
    });

    const fnUrl = fn.addFunctionUrl({
      authType: cdk.aws_lambda.FunctionUrlAuthType.NONE,
    });

    new cdk.aws_cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.FunctionUrlOrigin(fnUrl),
      },
    });
  }
}
