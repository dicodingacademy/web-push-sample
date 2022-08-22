import { Handler } from '@netlify/functions';
import webpush from 'web-push';
import { deleteSubscriptionsByEndpoint, getAllSubscriptions } from '../libs/database';
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

  const sendNotificationPromises = subscriptions
    .map(({ subscription }) => webpush.sendNotification(JSON.parse(subscription), notification));

  const results = await Promise.allSettled(sendNotificationPromises);

  const rejecteds = results.filter(({ status }) => status === 'rejected');

  const revokeSubscriptionPromises = rejecteds.map((rejected: any) => {
    const { endpoint } = rejected.reason;
    return deleteSubscriptionsByEndpoint(endpoint);
  });

  await Promise.allSettled(revokeSubscriptionPromises);

  return {
    statusCode: 200,
    headers: config.functions.headers,
    body: JSON.stringify({
      message: 'OK',
    }),
  };
};

export { handler };
