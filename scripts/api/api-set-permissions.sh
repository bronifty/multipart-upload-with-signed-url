#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if a function name was passed as an argument
if [ -z "$2" ]; then
    echo "No function name provided. Using default function name: $DEFAULT_FUNCTION_NAME"
    FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
else
    FUNCTION_NAME=$2  # Set the function name from the second script argument
fi

# Check if an API ID was passed as an argument
if [ -z "$1" ]; then
    echo "No API ID provided. Exiting."
    exit 1
else
    API_ID=$1  # Set the API ID from the first script argument
fi


aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-default --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/default"