import { Handler } from '@netlify/functions';
import { addSubscription } from '../libs/database';

const handler: Handler = async (event) => {
  await addSubscription(event.body);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'OK',
    }),
    headers,
  };
};

export { handler };
