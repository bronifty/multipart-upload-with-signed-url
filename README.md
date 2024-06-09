# AWS Serverless Toolbelt

## Design Decisions Document

I'm at a fork in the road because I got express working in lambda integrated with apigatewayv2 http with a catchall route, but only the root route ("/") works not any others. Rather than attempting to t-shoot that, which could suck up several days or more and involve fiddling with express, which I won't standardize on anyway, I choose to learn fastify and standardize on that. Along the way, I can use their tools for integration with api gateway and lambda, which is in the book on kindle here [accelerating server side development with fastify](https://read.amazon.com/?asin=B0B2PR8RQY&ref_=kwl_kr_iv_rec_16).

I have some other generic aws and more specifically aws serverless books I could read or I could trawl the aws docs on the apigateway subject, but that could take a lot of time and I'm not sure if I will even find what I'm looking for. That is, a standardized way of deploying ssr apps with aws on lambda and apigateway as well as using cloudfront cdn as a proxy for both data fetching (GET requests loaded with server routes) and the assets build (vite with remix plugin).

### Notes:

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

8. api cleanup

```sh
make api-cleanup
```

---
