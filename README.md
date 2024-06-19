# Multipart Upload with Signed URLs

```sh
pnpm sdk
```

- make sure your aws creds are configured and your server knows how to connect to it (eg by pasting your creds in the terminal, using aws sso login, or using keys)
- navigate to http://localhost:3000 and input the bucket name
- then either list your current files or upload a new one
  - note: download buttons don't work this is an issue with the html setup; gonna switch to react so there's a better story around manipulating the dom and dynamic objects
- choose file and upload (watch the console; we're gonna get feedback on the ui soon)
- it will upload any size file up to 5TB from the browser in chunks of 5MB apiece by making 3 different types of requests:
  1. POST /getPresignedUrl will start the mpu to get an upload id, which it will use in subsequent requests (each upload part and the complete or abort call requires upload id); the POST will return the url and part number for the chunks of the file
  2. PUT `https://${BUCKET}.s3.${REGION}.amazonaws.com/${KEY}?${SIGNED_HASH}=UploadPart` to each url returned by the previous request with the upload id and part number in the header with the byte range buffer as payload
  3. POST /completeMultipartUpload once all parts have been uploaded

[aws-sdk-js-v3](https://github.com/aws/aws-sdk-js-v3/tree/main)

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

#### TODO

UI:

- progress bar
- crud
- auth

SERVER:

- lambdaify the server (and ultimately, use fastify not express)
- add a cloudfront proxy for the site and api

---

### Links

- [learning with jason starring matteo](https://www.youtube.com/watch?v=evCnOaVaOTo)
- [cloudfront-hosting-toolkit](https://blog.awsfundamentals.com/cloudfront-hosting-toolkit?utm_source=pocket_shared)
- [aws-sdkv3-js-notes-app](https://github.com/aws-samples/aws-sdk-js-notes-app)
- [accelerating server side development with fastify](https://read.amazon.com/?asin=B0B2PR8RQY&ref_=kwl_kr_iv_rec_16)
- [embed-wasm-blob](https://webreflection.medium.com/how-to-embed-your-wasm-blob-c29692119039)

---

### CLI

The cli part of this toolbox is in the Makefile and scripts (not all scripts are in the makefile, maybe some makefile scripts are incorrectly referencing existing scripts).

The purpose of the cli is to get things set up with deployments in the most straightforward manner possible using discrete logical steps. These can be composed together, but the purpose is to keep things as simple and as direct as possible. That's why it's here.

The sdkv3 will be the main tool for interacting with the services, but getting them stood up will rely on the cli most likely unless the sdk can do that too. Ultimately, tho, I want to integrate this into cdk and winglang eventually as libraries.

### Monorepo

I wanted to make this a monorepo but i kept getting stuck on how the node_modules folder is hoisted or not into each package and app. I may not want to install every separate package and app's deps globally, so I think putting a package.json in the root with some scripts that can use --prefix is good enough. I don't need to make it a proper monorepo that does the weird caching and hoisting thing. I may change my opinion, but for now, that is the simplest and most straightforward approach I can think of when i want to rapidly fire off these requests and capture these responses and get fast feedback in my development.

https://nodejs.org/api/wasi.html

### Clean

// In the provided TypeScript code snippet from [multipart-upload-with-signed-url/clean.ts](file:///Users/bro/codes/fastify/multipart-upload-with-signed-url/clean.ts#1%2C1-1%2C1), the [dirPath](file:///Users/bro/codes/fastify/multipart-upload-with-signed-url/clean.ts#17%2C15-17%2C15) calculation is designed to identify and construct the path of the directory that contains either [node_modules](file:///Users/bro/codes/fastify/multipart-upload-with-signed-url/clean.ts#10%2C23-10%2C23), `cdk.out`, or [dist](file:///Users/bro/codes/fastify/multipart-upload-with-signed-url/clean.ts#12%2C23-12%2C23) within the file path. Here's a breakdown of how it works:

```typescript
file.split(/\/(node_modules|cdk.out|dist)\//)[0];
```

This part of the code uses a regular expression to split the `file` path at the first occurrence of any of the directories `node_modules`, `cdk.out`, or `dist`. The `[0]` at the end of the split function fetches the portion of the path before this directory. For example, if `file` is `/home/user/project/node_modules/package/index.js`, this expression returns `/home/user/project`.

```typescript
file.match(/\/(node_modules|cdk.out|dist)\//)[0];
```

This part uses the same regular expression to find the first occurrence of `/node_modules/`, `/cdk.out/`, or `/dist/` in the `file` path. The `[0]` fetches the matched string including the slashes, e.g., `/node_modules/`.

3. **Concatenation**:

   The two parts are concatenated to form the complete directory path that needs to be considered for removal. Continuing with the previous example, concatenating the results of the split and match operations gives `/home/user/project/node_modules/`.

This approach ensures that the script correctly identifies the full path of the directories to be removed, including the specific subdirectory (`node_modules`, `cdk.out`, or `dist`) that triggered the match. This is crucial for accurately targeting directories for cleanup without affecting other parts of the filesystem unintentionally.

#### Shell command note:

```sh
pnpm i && tsx clean.ts > output.log 2>&1
```

2 is standard error, redirect (>) that to same as 1, which is standard out
