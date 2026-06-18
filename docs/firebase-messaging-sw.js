// Firebase Cloud Messaging service worker placeholder.
// Add Firebase compat scripts and project config here when push notifications are enabled.
self.addEventListener("push", (event) => {
  const fallback = {
    title: "Mochi",
    body: "Your cat is thinking about you."
  };

  const data = event.data ? event.data.json() : fallback;
  event.waitUntil(
    self.registration.showNotification(data.title || fallback.title, {
      body: data.body || fallback.body,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png"
    })
  );
});
