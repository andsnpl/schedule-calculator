'use strict';

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var title = 'Schedule changed.';
  var body = 'A schedule you are assigned to has been added or changed.';

  event.waitUntil(self.registration.showNotification(title, {
    body: body
  }));
});