import { Handler } from '@netlify/functions';
import { removeSubscription } from '../libs/database';

const handler: Handler = async (event) => {
  await removeSubscription(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
