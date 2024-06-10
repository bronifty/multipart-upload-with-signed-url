# AWS Serverless Toolbelt

---

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

- [cloudfront-hosting-toolkit](https://blog.awsfundamentals.com/cloudfront-hosting-toolkit?utm_source=pocket_shared)
- [aws-sdkv3-js-notes-app](https://github.com/aws-samples/aws-sdk-js-notes-app)
- [accelerating server side development with fastify](https://read.amazon.com/?asin=B0B2PR8RQY&ref_=kwl_kr_iv_rec_16)
- [embed-wasm-blob](https://webreflection.medium.com/how-to-embed-your-wasm-blob-c29692119039)

---

### CLI

The cli part of this toolbox is in the Makefile and scripts (not all scripts are in the makefile, maybe some makefile scripts are incorrectly referencing existing scripts).

The purpose of the cli is to get things set up with deployments in the most straightforward manner possible using discrete logical steps. These can be composed together, but the purpose is to keep things as simple and as direct as possible. That's why it's here.

The sdkv3 will be the main tool for interacting with the services, but getting them stood up will rely on the cli most likely unless the sdk can do that too. Ultimately, tho, I want to integrate this into cdk and winglang eventually as libraries.
