// utils/notifications.js
export const requestNotificationPermission = () => {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      console.log("Notification Permission:", permission);
    });
  }
};

export const showNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
    //   icon: "/chat-icon.png", // You can change this to your app's icon
    });
  }
};
