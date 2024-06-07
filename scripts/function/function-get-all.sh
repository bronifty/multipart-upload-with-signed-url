#!/bin/bash
aws lambda list-functions

# aws lambda list-functions --query 'Functions[*].FunctionName' --output text

# "Functions": [
#         {
#             "FunctionName": "function",
#             "FunctionArn": "arn:aws:lambda:us-east-1:851725517932:function:function",
#             "Runtime": "nodejs20.x",
#             "Role": "arn:aws:iam::851725517932:role/lambda-full-access",
#             "Handler": "index.handler",
#         }
#     ]