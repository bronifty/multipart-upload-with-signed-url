aws lambda add-permission --function-name $FUNCTION_NAME --statement-id apigateway-default --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/default"

