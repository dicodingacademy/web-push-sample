self.addEventListener('install', () => {
  self.skipWaiting().then(() => console.log('Service Worker: Installed'));
});

self.addEventListener('push', (event) => {
  const notification = event.data.json();
  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
});
