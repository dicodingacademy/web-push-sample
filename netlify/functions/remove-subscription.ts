import { Handler } from '@netlify/functions';
import { removeSubscription } from '../libs/database';
import config from '../libs/config';

const handler: Handler = async (event) => {
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
