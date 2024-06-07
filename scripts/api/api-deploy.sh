#!/bin/bash

# Check if an API ID was passed as an argument
if [ -z "$1" ]; then
    echo "No API ID provided. Exiting."
    exit 1
else
    API_ID=$1  # Set the API ID from the first script argument
fi
aws apigatewayv2 create-deployment --api-id $API_ID --stage-name default