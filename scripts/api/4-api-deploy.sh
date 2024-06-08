#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

# Check if an API ID was passed as an argument
if [ -z "$1" ]; then
    echo "No api name provided. Using default api name: $DEFAULT_API_NAME"
    API_NAME=$DEFAULT_API_NAME
else
    API_NAME=$1
    API_ID=$(aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}'].ApiId" --output json | jq -r '.[]')
fi

aws apigatewayv2 create-deployment --api-id ${API_ID} --stage-name default

