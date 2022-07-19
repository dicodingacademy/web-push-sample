import { Handler } from '@netlify/functions';
import { addSubscription } from '../libs/database';
import config from '../libs/config';

const handler: Handler = async (event) => {
  await addSubscription(event.body);
  return {
    statusCode: 201,
    headers: config.functions.headers,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
