// public/sw.js

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  clients.claim();
});

self.addEventListener("push", function (event) {
  const payload = event.data ? event.data.text() : "no payload";

  const title = "プッシュ通知テスト";
  const options = {
    body: payload,
    icon: null,
    badge: null,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow("https://google.com"));
});
