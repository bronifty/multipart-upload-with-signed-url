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

aws apigatewayv2 get-integrations --api-id $API_ID --region $REGION