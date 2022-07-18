export default {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    subscriptionsTable: {
      name: process.env.SUPABASE_SUBSCRIPTIONS_TABLE_NAME,
    },
  },
  webPush: {
    vapidPublicKey: process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.WEB_PUSH_VAPID_PRIVATE_KEY,
  },
};
