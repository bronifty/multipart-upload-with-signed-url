#!/bin/bash
http_api_ids=$(aws apigatewayv2 get-apis --query 'Items[*].ApiId' --output text)
# Delete HTTP APIs
for http_api_id in $http_api_ids; do
    aws apigatewayv2 delete-api --api-id $http_api_id
    echo "Deleted HTTP API: $http_api_id"
done