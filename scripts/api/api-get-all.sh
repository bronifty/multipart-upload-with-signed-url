#!/bin/bash
aws apigatewayv2 get-apis --query 'Items[*].ApiId'

# aws apigatewayv2 get-apis --query 'Items[*].ApiEndpoint'

# "Items": [
#         {
#             "ApiEndpoint": "https://l4bykgc6k6.execute-api.us-east-1.amazonaws.com",
#             "ApiId": "l4bykgc6k6",
#             "ApiKeySelectionExpression": "$request.header.x-api-key",
#             "CreatedDate": "2024-05-31T02:43:57+00:00",
#             "DisableExecuteApiEndpoint": false,
#             "Name": "api",
#             "ProtocolType": "HTTP",
#             "RouteSelectionExpression": "$request.method $request.path",
#             "Tags": {}
#         }
#     ]