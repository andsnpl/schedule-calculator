import angular from 'angular';

let app = angular.module('scheduleCalculator');

app.factory('pushNotifications', [
  '$q', '$http', 'APISERVER',
  function ($q, $http, APISERVER) {
    let supported = 'serviceWorker' in navigator;
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
          } else if (!('PushManager' in window)) {
            console.warn('push messaging not supported.');
            return $q.reject();
          }
          return navigator.serviceWorker.ready;
        });
    } else {
      console.warn('service workers not supported.');
      ready = $q.reject();
    }

    let requestSubscription = function (serviceWorkerRegistration) {
      console.log('requesting subscription');
      return serviceWorkerRegistration.pushManager
        .subscribe({ userVisibleOnly: true });
    };

    let addSubscription = function (subscription) {
      console.log('got subscription, sending to server');
      return $http.post(`${APISERVER}/subscribe`, JSON.stringify(subscription));
    };

    return {
      supported,
      ready,
      subscribe() {
        return this.ready
          .then(requestSubscription)
          .then(addSubscription)
          .catch(function (err) {
            console.error(err);
          });
      }
    };
  }
]);
