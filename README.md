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
make api-get-all-integrations api=api
```

9. grant permissions

```sh
make api-grant-permissions function=function api=api
```

https://8w9u272tvf.execute-api.us-east-1.amazonaws.com/function

10. deploy

```sh
   aws apigatewayv2 create-deployment \
       --api-id 8w9u272tvf \
       --stage-name $default
```

11. clean up

```sh
make api-cleanup
```
