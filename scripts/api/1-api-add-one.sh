#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if both a function name and API name were passed as arguments
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <api-name> <function-name>"
    if [ -z "$1" ]; then
        echo "No API name provided. Using default API name: $DEFAULT_API_NAME"
        API_NAME=$DEFAULT_API_NAME
    else
        API_NAME=$1
    fi
    if [ -z "$2" ]; then
        echo "No function name provided. Using default function name: $DEFAULT_FUNCTION_NAME"
        FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
    else
        FUNCTION_NAME=$2
    fi
else
    API_NAME=$1      # Set the API name from the second script argument
    FUNCTION_NAME=$2  # Set the function name from the first script argument
fi

aws apigatewayv2 create-api --name $API_NAME --protocol-type 'HTTP' --target arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME