1. **Create the Integration**:

   ```bash
   aws apigatewayv2 create-integration --api-id API_ID --integration-type AWS_PROXY --integration-method POST --integration-uri arn:aws:apigateway:REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:REGION:ACCOUNT_ID:function:FUNCTION_NAME/invocations --payload-format-version 2.0
   ```

2. **Create the `$default` Route**:

   ```bash
   aws apigatewayv2 create-route --api-id API_ID --route-key '$default' --target integrations/INTEGRATION_ID
   ```

3. **Deploy the API to the `default` Stage**:

   ```bash
   aws apigatewayv2 create-deployment --api-id API_ID --stage-name default
   ```

4. **Set Permissions for Lambda Invocation**:
   ```bash
   aws lambda add-permission --function-name FUNCTION_NAME --statement-id apigateway-default --action lambda:InvokeFunction --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:REGION:ACCOUNT_ID:API_ID/*/default"
   ```
