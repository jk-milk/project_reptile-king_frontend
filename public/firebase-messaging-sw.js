/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm service worker가 실행되었습니다.");
});

const firebaseConfig = {
  apiKey: "AIzaSyAwAGq-YduSMYGJlXjTnDyXV5nkodPqPLc",
  authDomain: "pachungking-7381e.firebaseapp.com",
  projectId: "pachungking-7381e",
  storageBucket: "pachungking-7381e.appspot.com",
  messagingSenderId: "567774172744",
  appId: "1:567774172744:web:6b95a045605f882db36a7d",
  measurementId: "G-443Z6CDVF1"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
