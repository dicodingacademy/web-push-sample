import { Handler } from '@netlify/functions';
import { addSubscription } from '../libs/database';

const handler: Handler = async (event) => {
  await addSubscription(event.body);
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
