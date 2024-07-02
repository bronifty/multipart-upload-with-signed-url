#!/usr/bin/env node

// import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { S3Stack } from "./s3-stack";
import { LambdaStack } from "./lambda-stack";

const app = new cdk.App();

new S3Stack(app, "S3Stack", {
  env: { region: "us-east-1" },
  description: "S3 Stack",
});

new LambdaStack(app, "LambdaStack", {
  env: { region: "us-east-1" },
  description: "Lambda Stack",
});
