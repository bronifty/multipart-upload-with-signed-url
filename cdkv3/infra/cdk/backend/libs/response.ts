const buildResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    "access-control-allow-origin": "*",
    "access-control-allow-credentials": true,
  },
  body: JSON.stringify(body),
});

export const success = (body: any) => {
  return buildResponse(200, body);
};

export const failure = (body: any) => {
  return buildResponse(500, body);
};
