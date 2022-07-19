import { Handler } from '@netlify/functions';
import { removeSubscription } from '../libs/database';
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

  await removeSubscription(event.body);

  return {
    statusCode: 200,
    headers: config.functions.headers,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
