import { Handler } from '@netlify/functions';
import { addSubscription } from '../libs/database';
import config from '../libs/config';

const handler: Handler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: config.functions.headers,
      body: JSON.stringify({
        message: 'No subscription data provided',
      }),
    };
  }

  const { endpoint } = JSON.parse(event.body);

  await addSubscription(event.body, endpoint);

  return {
    statusCode: 201,
    headers: config.functions.headers,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
