#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if an API ID was passed as an argument
if [ -z "$1" ]; then
    echo "No API ID provided. Exiting."
    exit 1
else
    API_ID=$1  # Set the API ID from the first script argument
fi

# Check if a function name was passed as an argument
if [ -z "$2" ]; then
    echo "No function name provided. Using default function name: $DEFAULT_FUNCTION_NAME"
    FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
else
    FUNCTION_NAME=$2  # Set the function name from the second script argument
fi

aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-method POST --integration-uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME/invocations --payload-format-version 2.0




