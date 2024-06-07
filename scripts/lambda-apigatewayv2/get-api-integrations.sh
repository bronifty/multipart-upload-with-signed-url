#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# aws apigatewayv2 get-integrations --api-id API_ID

API_NAME="api"
API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}'].ApiId" --output json | jq -r '.[]')
echo ${API_ID}
aws apigatewayv2 get-integrations --api-id ${API_ID} > ${SCRIPT_DIR}/output/${API_NAME}-integrations.json

