function handler(event: any) {
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

export { handler };
