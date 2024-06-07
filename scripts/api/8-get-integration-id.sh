# Create the integration and capture the output
INTEGRATION_OUTPUT=$(aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-method POST --integration-uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME/invocations --payload-format-version 2.0)

# Extract the Integration ID from the output
INTEGRATION_ID=$(echo $INTEGRATION_OUTPUT | jq -r '.IntegrationId')



#!/bin/bash

# Source the default variables
source /path/to/variables.sh

# Create the integration and capture the output
INTEGRATION_OUTPUT=$(aws apigatewayv2 create-integration --api-id $API_ID --integration-type AWS_PROXY --integration-method POST --integration-uri arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$FUNCTION_NAME/invocations --payload-format-version 2.0)

# Extract the Integration ID from the output
INTEGRATION_ID=$(echo $INTEGRATION_OUTPUT | jq -r '.IntegrationId')

# Create the `$default` route using the Integration ID
aws apigatewayv2 create-route --api-id $API_ID --route-key '$default' --target "integrations/$INTEGRATION_ID"

# Deploy the API to the `default` stage
aws apigatewayv2 create-deployment --api-id $API_ID --stage-name default

# Set permissions for Lambda invocation
aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-default --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/default"