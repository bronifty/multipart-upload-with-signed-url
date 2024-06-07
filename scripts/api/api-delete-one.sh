#!/bin/bash

# Delete an API Gateway given its ID
api_id=$1  # Get API ID from the first script argument

aws apigatewayv2 delete-api --api-id "$api_id"