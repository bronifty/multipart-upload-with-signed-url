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
