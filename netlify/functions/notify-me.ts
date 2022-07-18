import { Handler } from '@netlify/functions';
import webpush from 'web-push';
import config from '../libs/config';

const handler: Handler = async (event) => {
  webpush.setVapidDetails('mailto:academy@dicoding.com', config.webPush.vapidPublicKey, config.webPush.vapidPrivateKey);
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
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
