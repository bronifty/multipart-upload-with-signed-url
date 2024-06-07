#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"

aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-method POST --integration-uri arn:aws:function:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME --payload-format-version 2.0