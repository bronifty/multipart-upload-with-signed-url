# AWS Serverless Toolbelt

### Multipart Upload with Signed URLs from the Browser hitting a nodejs server backend

```sh
pnpm sdk
```

- navigate to http://localhost:3000
- choose file and upload (watch the console; we're gonna get feedback on the ui soon)
- it will upload any size file up to 5TB from the browser in chunks of 5MB apiece by making 3 different types of requests:
  1. POST /getPresignedUrl will start the mpu to get an upload id, which it will use in subsequent requests (each upload part and the complete or abort call requires upload id); the POST will return the url and part number for the chunks of the file
  2. PUT `/https://${BUCKET}.s3.${REGION}.amazonaws.com/${KEY}?${SIGNED_HASH}=UploadPart` to each url returned by the previous request with the upload id and part number in the header with the byte range buffer as payload
  3. POST /completeMultipartUpload once all parts have been uploaded

[aws-sdk-js-v3](https://github.com/aws/aws-sdk-js-v3/tree/main)

- Update: sdkv3 Multipart Upload with Signed URLs working from browser [here](engine/aws-sdk/public/index.html)
- also sdkv3 mpu upload (parallel) on server working
- notably, the s3 bucket needed cors settings to allow all origins (this needs to be protected by a login first tho; we'll have to do that soon) and also expose the ETag header

[cors-config-set.sh](scripts/s3/cors-config-set.sh)

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

- next steps on the mpu will be to:
  - show progress bar of upload on page
  - list uploads in bucket
  - download from bucket
  - delete from bucket
  - add login flow

### Note:

- my workflow is to copy and paste the aws credentials in the cmd line so that the aws sdk client is respected by the server

```sh
pnpm --prefix ./aws-sdk install && pnpm --prefix ./aws-sdk start
```

- next steps will include moving the server to a lambda (and cloudfront proxy?)

### TODO

- [cloudfront-hosting-toolkit](https://blog.awsfundamentals.com/cloudfront-hosting-toolkit?utm_source=pocket_shared)
- [aws-sdkv3-js-notes-app](https://github.com/aws-samples/aws-sdk-js-notes-app)
- [accelerating server side development with fastify](https://read.amazon.com/?asin=B0B2PR8RQY&ref_=kwl_kr_iv_rec_16)
- [embed-wasm-blob](https://webreflection.medium.com/how-to-embed-your-wasm-blob-c29692119039)

---

## Design Decisions Document

I'm at a fork in the road because I got express working in lambda integrated with apigatewayv2 http with a catchall route, but only the root route ("/") works not any others. Rather than attempting to t-shoot that, which could suck up several days or more and involve fiddling with express, which I won't standardize on anyway, I choose to learn fastify and standardize on that. Along the way, I can use their tools for integration with api gateway and lambda, which is in the book on kindle here [accelerating server side development with fastify](https://read.amazon.com/?asin=B0B2PR8RQY&ref_=kwl_kr_iv_rec_16).

I have some other generic aws and more specifically aws serverless books I could read or I could trawl the aws docs on the apigateway subject, but that could take a lot of time and I'm not sure if I will even find what I'm looking for. That is, a standardized way of deploying ssr apps with aws on lambda and apigateway as well as using cloudfront cdn as a proxy for both data fetching (GET requests loaded with server routes) and the assets build (vite with remix plugin).

Another note about why I'm not going to try the more general serverless route is they are using the serverless-http framework with which i'm already aware. I don't want to delve any deeper into that it is not solving my issue and I don't want to use a template language like cloudformation or sam to deploy my apps.

While I'm on this road I will check out SST. I created a separate AWS account for it and set up an sso profile, which works alongside my default profile. There are no keys or secrets, only oauth in the browser granting my cli access with a short-lived token. The difference between a request to my default and sst profiles is the addition of the --profile sst flag and value after the command.

```sh
aws s3 ls # default profile
aws s3 ls --profile sst # sst profile
```

Notably, while I was setting up access to the SST AWS account, I stumbled upon (looked into and got a recommendation from cursor ide which uses chatgpt) a version of the aws cli for s3 that works incredibly well for multipart upload. I would like to use that [s3api](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3api/index.html#cli-aws-s3api) for the calls around which i will wrap some lightweight javascript to functionalize it and make it calleable from code.

I would like to bundle the cli with this custom sdk wrapping cli calls with js by building the aws cli from source, compiling it to the wasm target and dropping it in a lib folder.

I'm going to convert these bash scripts into js functions that call the aws cli to get the multipart upload working (something I've wanted to do for a long time) and then I'll start in with SST and Fastify.

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
