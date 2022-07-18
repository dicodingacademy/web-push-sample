import { Handler } from '@netlify/functions';
import webpush from 'web-push';
import { getAllSubscriptions } from '../libs/database';
import config from '../libs/config';

const handler: Handler = async (event) => {
  webpush.setVapidDetails('mailto:academy@dicoding.com', config.webPush.vapidPublicKey, config.webPush.vapidPrivateKey);
  const { data: { message } } = JSON.parse(event.body);
  const subscriptions = await getAllSubscriptions();

  const notification = JSON.stringify({
    title: 'Dicoding Academy',
    options: {
      body: message,
    },
  });

  subscriptions.forEach(({ subscription }) => {
    webpush.sendNotification(JSON.parse(subscription), notification);
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
