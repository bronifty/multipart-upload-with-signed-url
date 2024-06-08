# AWS Serverless Toolbelt

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/get-function.html

steps:

1. zip a working express app
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

7. create api integration

```sh
make api-create-integration api=api function=function
```

8. get all api integrations

```sh
make api-get-integrations api=api
```

```json
{
  "Items": [
    {
      "ConnectionType": "INTERNET",
      "IntegrationId": "4x8z9k9",
      "IntegrationMethod": "POST",
      "IntegrationType": "AWS_PROXY",
      "IntegrationUri": "arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/arn:aws:lambda:us-east-1:851725517932:function:function/invocations",
      "PayloadFormatVersion": "2.0",
      "TimeoutInMillis": 30000
    },
    {
      "ApiGatewayManaged": true,
      "ConnectionType": "INTERNET",
      "IntegrationId": "4yt8bns",
      "IntegrationMethod": "POST",
      "IntegrationType": "AWS_PROXY",
      "IntegrationUri": "arn:aws:lambda:us-east-1:851725517932:function:function",
      "PayloadFormatVersion": "2.0",
      "TimeoutInMillis": 30000
    }
  ]
}
```
