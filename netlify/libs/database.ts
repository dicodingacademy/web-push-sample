import supabase from './supabase';
import config from './config';

async function addSubscription(subscription: string, endpoint: string) {
  const { error } = await supabase.from(config.supabase.subscriptionsTable.name).insert({
    subscription,
    endpoint,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function findSubscription(subscription: string) {
  const { data, error } = await supabase.from(config.supabase.subscriptionsTable.name).select('subscription').match({
    subscription,
  });

  if (error) {
    return null;
  }

  return data;
}

async function getAllSubscriptions() {
  const { data, error } = await supabase.from(config.supabase.subscriptionsTable.name).select('subscription');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function removeSubscription(subscription: string) {
  const { error } = await supabase.from(config.supabase.subscriptionsTable.name).delete().match({
    subscription,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function deleteSubscriptionsByEndpoint(endpoint: string) {
  const { error } = await supabase.from(config.supabase.subscriptionsTable.name).delete().match({
    endpoint,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export {
  addSubscription,
  removeSubscription,
  findSubscription,
  getAllSubscriptions,
  deleteSubscriptionsByEndpoint,
};
