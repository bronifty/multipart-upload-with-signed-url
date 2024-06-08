#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh


# Check if an API ID was passed as an argument
if [ -z "$1" ]; then
    echo "No FUNCTION name provided. Using default FUNCTION name: $DEFAULT_FUNCTION_NAME"
    FUNCTION_NAME=$DEFAULT_FUNCTION_NAME
else
    FUNCTION_NAME=$1
fi

# Check if an API ID was passed as an argument
if [ -z "$2" ]; then
    echo "No api name provided. Using default api name: $DEFAULT_API_NAME"
    API_NAME=$DEFAULT_API_NAME
    API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}'].ApiId" --output json | jq -r '.[]')
else
    API_NAME=$1
    API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}'].ApiId" --output json | jq -r '.[]')
fi


# aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-default --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/default"


aws lambda add-permission \
  --function-name $FUNCTION_NAME \
  --statement-id api-gateway-access \
  --action "lambda:InvokeFunction" \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*"

