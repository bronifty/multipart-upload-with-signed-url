#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh


API_NAME="api"
aws apigatewayv2 get-apis --query "Items[?Name=='${API_NAME}']" --output json > $SCRIPT_DIR/output/api_info.json

