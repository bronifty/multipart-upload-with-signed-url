# AWS Serverless Toolbelt

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/get-function.html

steps:

1. zip a working express app

```sh
make app-install
```

2. deploy the function (there are scripts for deploy update and invoke)

```sh
make function-deploy function=function
```

3. get all functions

```sh
make function-get-all
```

4. invoke the function

```sh
make function-invoke function=function
```

5. create an http api

```sh
make api-add-one api=api function=function
```

6. get all apis

```sh
make api-get-all
```

7. grant permissions

```sh
make api-grant-permissions api=api function=function
```

create default route to trigger lambda with http api

To create a default route to trigger a Lambda function with an HTTP API in AWS, you can follow these steps:

Deploy a Lambda function that will handle the incoming HTTP requests.

Create an AWS API Gateway HTTP API.

Define a default route in the HTTP API that will route all incoming requests to the Lambda function.

Grant permission to the API Gateway to invoke the Lambda function.

Here are the detailed steps:

Deploy a Lambda Function:

Create a new Lambda function or use an existing one that will handle the incoming HTTP requests.
Ensure that the Lambda function is configured to handle the desired HTTP methods (e.g., GET, POST, etc.).
Create an AWS API Gateway HTTP API:

In the AWS Management Console, navigate to the API Gateway service.
Create a new HTTP API.
In the API settings, configure the default route to point to the Lambda function.
Define a Default Route:

In the HTTP API, create a new route with the path
/{proxy+}
.
Configure the integration type to be "Lambda" and select the Lambda function you deployed in step 1.
Grant Permission to API Gateway:

Navigate to the Lambda function in the AWS Management Console.

Add a new permission to the Lambda function's resource policy, allowing the API Gateway service to invoke the function.

You can use the following AWS CLI command to grant the permission:

aws lambda add-permission \
 --function-name your-lambda-function-name \
 --statement-id api-gateway-access \
 --action "lambda:InvokeFunction" \
 --principal apigateway.amazonaws.com \
 --source-arn "arn:aws:execute-api:your-region:your-account-id:your-api-id/\*"
Replace
your-lambda-function-name
,
your-region
,
your-account-id
, and
your-api-id
with the appropriate values for your setup.

After completing these steps, your HTTP API will have a default route that will trigger the specified Lambda function for all incoming requests. You can then use the API Gateway endpoint to send requests to your Lambda function.

Remember to refer to the latest AWS documentation for any updates or changes to the specific steps or configuration details.

Sources

[1] [Use API Gateway to invoke a Lambda function - AWS SDK Code Examples](https://docs.aws.amazon.com/code-library/latest/ug/cross_LambdaAPIGateway_python_3_topic.html)

[2] [CreateFunctionUrlConfig - AWS Lambda](https://docs.aws.amazon.com/lambda/latest/api/API_CreateFunctionUrlConfig.html)

[3] [Invoking Lambda function URLs - AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)
