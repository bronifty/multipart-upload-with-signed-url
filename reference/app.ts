import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-function";

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-function-proxy-integrations.html#api-gateway-simple-proxy-for-function-input-format
 * @param {Object} event - API Gateway function Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-function-proxy-integrations.html
 * @returns {Object} object - API Gateway function Proxy Output Format
 *
 */

export const functionHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "hello world",
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error happened",
      }),
    };
  }
};
