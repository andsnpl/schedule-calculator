import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('pushNotifications', [
  '$q', '$http', 'APISERVER',
  function ($q, $http, APISERVER) {
    let supported = 'serviceWorker' in navigator && 'PushManager' in window;
    let ready;

    if (supported) {
      ready = navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () {
          if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('notifications not supported.');
            return $q.reject();
          } else if (Notification.permission === 'denied') {
            console.warn('notifications permission is denied.');
            return $q.reject();
          }
          return navigator.serviceWorker.ready;
        });
    } else {
      console.warn('push messaging is not supported.');
      ready = $q.reject();
    }

    let requestSubscription = function (serviceWorkerRegistration) {
      return serviceWorkerRegistration.pushManager
        .subscribe({ userVisibleOnly: true });
    };

    let addSubscription = function (userId, subscription) {
      let data = JSON.stringify({
        userId,
        endpoint: subscription.endpoint,
      });
      return $http.post(`${APISERVER}/subscribe`, data);
    };

    return {
      supported,
      ready,
      subscribe(userId) {
        return this.ready
          .then(requestSubscription)
          .then(subscription => addSubscription(userId, subscription))
          .catch(function (err) {
            console.error(err);
          });
      }
    };
  }
]);
