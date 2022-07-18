(async () => {
  const VAPID_PUBLIC_KEY = 'BNCBMz0qWsThtCzIO4kfM0g0V3nCGHr1igP8CJLfX7pwKEpVPPkR1Kq7VY1OF-zVl4ea79tbv4RsoFeBW0ULZ5E';

  const taServiceWorker = document.querySelector('#textAreaServiceWorker');
  const taSubscription = document.querySelector('#textAreaSubscription');
  const taNotification = document.querySelector('#textAreaNotification');

  const btnRegisterServiceWorker = document.querySelector('#buttonRegisterServiceWorker');
  const btnUnregisterServiceWorker = document.querySelector('#buttonUnregisterServiceWorker');
  const btnSubscribe = document.querySelector('#buttonSubscribe');
  const btnUnsubscribe = document.querySelector('#buttonUnsubscribe');
  const btnNotifyMe = document.querySelector('#buttonNotifyMe');
  const btnNotifyAll = document.querySelector('#buttonNotifyAll');

  btnRegisterServiceWorker.addEventListener('click', async () => {
    await registerServiceWorker();
    await init();
  });

  btnUnregisterServiceWorker.addEventListener('click', async () => {
    await unregisterServiceWorker();
    await init();
  });

  btnSubscribe.addEventListener('click', async () => {
    await subscribePushNotification();
    await init();
  });

  btnUnsubscribe.addEventListener('click', async () => {
    await unsubscribePushNotification();
    await init();
  });

  btnNotifyMe.addEventListener('click', async () => {
    await notifyMe();
  });

  btnNotifyAll.addEventListener('click', async () => {
    await notifyAll();
  });

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        console.log('Service worker registration failed', e);
      }
    }
  }

  async function unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  }

  async function subscribePushNotification() {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await fetch('/.netlify/functions/add-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    return {
      endpoint: subscription.endpoint,
      p256Key: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
      authKey: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
    };
  }

  async function unsubscribePushNotification() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
    }

    await fetch('/.netlify/functions/remove-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  }

  async function notifyMe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await fetch('/.netlify/functions/notify-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            message: taNotification.value,
          },
          subscription,
        }),
      });
    }
  }

  async function notifyAll() {
    await fetch('/.netlify/functions/notify-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          message: taNotification.value,
        },
      }),
    });
  }

  function initialStateButton() {
    btnRegisterServiceWorker.disabled = true;
    btnUnregisterServiceWorker.disabled = true;
    btnSubscribe.disabled = true;
    btnUnsubscribe.disabled = true;
    btnNotifyMe.disabled = true;
    btnNotifyAll.disabled = false;
  }

  function whenUnsupportedServiceWorker() {
    taServiceWorker.value = 'Service Worker is not supported';
  }

  function whenServiceWorkerRegistered(registration) {
    taServiceWorker.value = `Service Worker registered: ${registration.scope}`;
    btnUnregisterServiceWorker.disabled = false;
  }

  function whenServiceWorkerUnregistered() {
    taServiceWorker.value = 'No service worker has been registered yet.';
    taSubscription.value = 'Push subscription on this client isn\'t possible until a service worker is registered.';
    taNotification.value = 'Push notification to this client isn\'t possible until a service worker is registered.';
    btnRegisterServiceWorker.disabled = false;
  }

  function whenClientHasNoSubscription() {
    taSubscription.value = 'Ready to subscribe this client to push.';
    taNotification.value = 'Push notification to this client will be possible once subscribed.';
    btnSubscribe.disabled = false;
  }

  function whenClientHasSubscription(subscription) {
    taSubscription.value = `Push subscription: ${subscription.endpoint}`;
    taNotification.value = 'Ready to send a push notification to this client!';
    btnUnsubscribe.disabled = false;
    btnNotifyMe.disabled = false;
    btnNotifyAll.disabled = false;
  }

  async function init() {
    initialStateButton();

    if (!('serviceWorker' in navigator)) {
      whenUnsupportedServiceWorker();
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      whenServiceWorkerUnregistered();
      return;
    }

    whenServiceWorkerRegistered(registration);

    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      whenClientHasNoSubscription();
      return;
    }

    whenClientHasSubscription(subscription);
  }

  await init();
})();
