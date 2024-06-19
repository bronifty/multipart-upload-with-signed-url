"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_sdk_js_notes_app_stack_1 = require("./aws-sdk-js-notes-app-stack");
const app = new aws_cdk_lib_1.App();
new aws_sdk_js_notes_app_stack_1.AwsSdkJsNotesAppStack(app, "aws-sdk-js-notes-app");
