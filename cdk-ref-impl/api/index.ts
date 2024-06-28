function handler(event) {
  return {
    statusCode: 200,
    statusDescription: "OK",
    headers: {
      "content-type": {
        value: "text/plain",
      },
    },
    body: "Hello, World!",
  };
}
