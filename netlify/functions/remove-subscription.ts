import { Handler } from '@netlify/functions';
import { removeSubscription } from '../libs/database';

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  await removeSubscription(event.body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
    }),
    headers,
  };
};

export { handler };
