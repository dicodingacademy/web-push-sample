import { Handler } from '@netlify/functions';
import webpush from 'web-push';
import { getAllSubscriptions } from '../libs/database';
import config from '../libs/config';

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  webpush.setVapidDetails('mailto:academy@dicoding.com', config.webPush.vapidPublicKey, config.webPush.vapidPrivateKey);
  const { data: { message } } = JSON.parse(event.body);
  const subscriptions = await getAllSubscriptions();

  const notification = JSON.stringify({
    title: 'Dicoding Academy',
    options: {
      body: message,
    },
  });

  const sendNotificationPromises = subscriptions
    .map(({ subscription }) => webpush.sendNotification(JSON.parse(subscription), notification));

  await Promise.all(sendNotificationPromises);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'OK',
    }),
    headers,
  };
};

export { handler };
