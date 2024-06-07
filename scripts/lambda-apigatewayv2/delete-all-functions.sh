#!/bin/bash

# List all Lambda functions
function_arns=$(aws lambda list-functions --query 'Functions[*].FunctionArn' --output text)

# Delete each function
for arn in $function_arns; do
    aws lambda delete-function --function-name $arn
    echo "Deleted Lambda function: $arn"
done