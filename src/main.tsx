import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import ScrollToTop from './components/common/ScrollToTop.ts'
import './index.css'
import { handleAllowNotification } from './services/notificationPermission.ts'
import { initializeNotificationListener } from './services/foregroundMessage.ts'


handleAllowNotification();
// initializeNotificationListener();

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function (registration) {
          console.log(
            "Service Worker가 scope에 등록되었습니다.:",
            registration.scope
          );
        })
        .catch(function (err) {
          console.log("Service Worker 등록 실패:", err);
        });
    });
  }
}

registerServiceWorker();



ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
)
