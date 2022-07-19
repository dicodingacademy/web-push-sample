import { Handler } from '@netlify/functions';
import webpush from 'web-push';
import config from '../libs/config';

const handler: Handler = async (event) => {
  webpush.setVapidDetails('mailto:academy@dicoding.com', config.webPush.vapidPublicKey, config.webPush.vapidPrivateKey);

  if (!event.body) {
    return {
      statusCode: 400,
      headers: config.functions.headers,
      body: JSON.stringify({
        message: 'No data provided',
      }),
    };
  }

  const { data, subscription } = JSON.parse(event.body);
  const { message } = data;

  const notification = JSON.stringify({
    title: 'Dicoding Academy',
    options: {
      body: message,
    },
  });

  await webpush.sendNotification(subscription, notification);

  return {
    statusCode: 200,
    headers: config.functions.headers,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
