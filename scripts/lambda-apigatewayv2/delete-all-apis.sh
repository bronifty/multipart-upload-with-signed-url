#!/bin/bash

# List all API Gateway (both REST and HTTP)
api_ids=$(aws apigateway get-rest-apis --query 'items[*].id' --output text)
http_api_ids=$(aws apigatewayv2 get-apis --query 'Items[*].ApiId' --output text)

# Delete REST APIs
for api_id in $api_ids; do
    aws apigateway delete-rest-api --rest-api-id $api_id
    echo "Deleted REST API: $api_id"
done

# Delete HTTP APIs
for http_api_id in $http_api_ids; do
    aws apigatewayv2 delete-api --api-id $http_api_id
    echo "Deleted HTTP API: $http_api_id"
done