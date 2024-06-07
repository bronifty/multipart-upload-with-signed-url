#!/bin/bash
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Source the scripts using the script directory path
source $SCRIPT_DIR/../variables.sh

FUNCTION_NAME="function"
# output lambda info to lambda_info.txt
   aws lambda get-function --function-name $FUNCTION_NAME > $SCRIPT_DIR/lambda_info.json
FUNCTION_NAME="function"
aws lambda get-function --function-name ${FUNCTION_NAME} --query "Configuration" --output json > $SCRIPT_DIR/output/function_info.json

