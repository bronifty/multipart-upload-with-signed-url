# AWS Serverless Toolbelt

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/lambda/get-function.html

steps:

1. make executable
2. aws_sso_login
3. dev
4. test
5. install
6. aws_function_list
7. delete all...
8. deploy
9. invoke
10. set up triggers...

- The main goal is to deploy ssr apps like remix, vite, vike, next, etc
- The orientation of the goal is from aws cli and work our way toward the cdk and then finally integrate into winglang
- This repo is based on a combination of different repos, namely one by vinny for express with an apigateway trigger via console; another based on the default sam hello world app with a test apigateway event sent to a function shaped request reply handler which also includes a nice typescript config and a test setup; and finally there is some stuff in here in the reference folder from the vercel remix plugin for vite as well as my own material in the makefile and scripts for sys admin stuff.
- What I would like to do is be able to get at any part of the serverless resources like function and apigatewayv2, cloudfront cdn and s3, even dynamodb and sqs and eventbridge, as well as step functions, perhaps some other stuff but those are the main ones. I want to have a system that puts these pieces together according to a formula, and then i want to incrementally incorporate those steps from cli into cdk and then finally bring some custom resources into winglang as libraries where they can be put to use in app products.
- Along the way I can imagine this or some derivative of it could become some kind of toolbelt and dev tool for creating serverless apps and monitoring them. The cli is one tool, sdk is another; requests could be made from a react dashboard to get all the resources listed and have a multitentant app to manage those resources.

### TODO:

- follow these instructions but set it up (the apigateway trigger) with cli and use apigatewayv2 with http api catchall stage route method etc proxy all traffic to the function; also set up another trigger that is proxying traffic from cloudfront cdn; this is going to require setting up an origin principal and also there are permissions that the function is going to need to have applied to it to assume role; actually i get confused on whether it is the function or the services (apigateway, cloudfront) that need the permissions applied to them to call the function; either way, that needs to be sorted out.
- also some of those scripts are going to be broken because i moved all the function ones into a subfolder and didn't change the way the variables are sourced in all of them. the directory structure and naming convention of the scripts esp w/r/t makefile will have to be updated for it to work (and even the makefile is not done; i'm not sure what exact shape that is going to take and whether these scripts are going to even be called from there or not).
- i want to set up pipe scripts that query all or one of a resource and pipe it to a create or delete script rather than hardcoding variables

# How to create a serverless express app:

## Important thing to know:

- Make sure you have your index.js file in the root of your projects directory. If this isn't here the function function will throw an error.
- Make sure you don't use the base route in your express server. HTTP requests to this base route will not be sent to our proxy function.

### Example:

#### Will not work

http://supercoolapigatewayurl.com/stageName

#### Will work

http://supercoolapigatewayurl.com/stageName/todos

## Create function function and API Gateway

1. First create your function function. You can upload this code by selecting the content of directory and compressing it. function allows you to take this zip file and upload it.
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/49013231/206956927-e444d463-4138-487f-bce5-d5b9117daeae.png">

2. Now you can create your API Gateway. I used the Rest API for this but I'm sure HTTP API would work as well.

3. You need to add a resource on your API Gateway on the root path. Be sure to check the boxes for configure as proxy resource and enable API Gateway CORS. Then you need to link this resource to the function function that we created earlier.
   <img width="900" alt="image" src="https://user-images.githubusercontent.com/49013231/206956849-6aaa5844-17c9-4d69-9213-7408c259c2c7.png">
   <img width="900" alt="image" src="https://user-images.githubusercontent.com/49013231/206956880-14b1ecd5-2052-4b8c-b2f3-3413ec2510b9.png">

4. Now that we finished creating all of our API Gateway changes we need to go and deploy the API so we can test it.
   <img width="500" alt="image" src="https://user-images.githubusercontent.com/49013231/206956693-e1685897-72b4-42e5-a563-2959d418c4de.png">
