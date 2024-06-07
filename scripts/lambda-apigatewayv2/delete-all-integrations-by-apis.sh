#!/bin/bash

# Assuming you have the API IDs stored or retrieved
api_ids=(list_of_api_ids)  # Replace list_of_api_ids with actual IDs or a command to retrieve them

# Delete integrations for each API
for api_id in "${api_ids[@]}"; do
    # Get all integrations for the API
    integration_ids=$(aws apigatewayv2 get-integrations --api-id $api_id --query 'Items[*].IntegrationId' --output text)
    
    # Delete each integration
    for integration_id in $integration_ids; do
        aws apigatewayv2 delete-integration --api-id $api_id --integration-id $integration_id
        echo "Deleted integration $integration_id for API $api_id"
    done
done