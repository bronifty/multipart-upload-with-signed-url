function handler(event: any) {
  return {
    statusCode: 200,
    statusDescription: "OK",
    headers: {
      "content-type": {
        value: "application/json",
      },
    },
    body: JSON.stringify({ message: "Hello, World!" }), // JSON stringified response
  };
}

export { handler };
