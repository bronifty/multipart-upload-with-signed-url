#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source "$SCRIPT_DIR/variables.sh"

# Retrieve the integration ID for the specific function
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id $API_ID | jq -r '.Items[] | select(.IntegrationUri | contains("'$FUNCTION_NAME'")) | .IntegrationId')

API_ID=$(aws apigatewayv2 get-apis | jq -r '.Items[] | select(.Name == "'$HTTP_API_NAME'") | .ApiId')

# Get the API ID
aws apigatewayv2 get-apis
# Get the integration ID
aws apigatewayv2 get-integrations --api-id $API_ID

aws apigatewayv2 create-route --api-id $API_ID --route-key 'ANY /{proxy+}' --target integrations/$INTEGRATION_ID