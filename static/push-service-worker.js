self.addEventListener('push', function(event) {
  event.waitUntil(self.registration.showNotification('Notification Title', {
    body: 'Notification body text',
    icon: '/img/favicon.png'
  }));
});

self.addEventListener('pushsubscriptionchange', function(event) {
  // handle subscription change
});