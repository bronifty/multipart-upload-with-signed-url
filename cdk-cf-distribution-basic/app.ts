#!/usr/bin/env node

// import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { AppStack } from "./stack";

const app = new cdk.App();

new AppStack(app, "AppStack", {
  env: { region: "us-east-1" },
  description: "App Stack",
});
