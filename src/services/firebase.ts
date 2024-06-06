import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAwAGq-YduSMYGJlXjTnDyXV5nkodPqPLc",
  authDomain: "pachungking-7381e.firebaseapp.com",
  projectId: "pachungking-7381e",
  storageBucket: "pachungking-7381e.appspot.com",
  messagingSenderId: "567774172744",
  appId: "1:567774172744:web:6b95a045605f882db36a7d",
  measurementId: "G-443Z6CDVF1"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };