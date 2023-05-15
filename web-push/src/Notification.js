const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("/sw.js");
  return swRegistration;
};

const askPermission = async (swRegistration) => {
  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }

  // デモ版のため毎回サブスクリプションを解除する
  // 本番の設計時は注意すること
  navigator.serviceWorker.ready.then((registration) => {
    registration.pushManager.getSubscription().then((subscription) => {
      // ここで得られた subscription が既存のサブスクリプションです。
      subscription.unsubscribe().then(() => {
        console.log("Unsubscribed successfully.");
      });
    });
  });
  return swRegistration;
};

const sendSubscription = async (subscription) => {
  const response = await fetch("http://localhost:5000/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

const subscribeUser = async (swRegistration) => {
  fetch("http://localhost:5000/vapidPublicKey")
    .then((response) => response.text())
    .then(async (vapidPublicKey) => {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
      await sendSubscription(subscription);
    });
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData;
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const Notification = () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    registerServiceWorker()
      .then(askPermission)
      .then(subscribeUser)
      .catch(console.error);
  }
};

export default Notification;
