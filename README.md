# A PROOF OF CONCEPT OF CLIENT-SIDE IMPLEMENTATION OF FIREBASE CLOUD MESSAGING THROUGH NEXT JS

## Install firebase sdk

```bash
npm install firebase
```

## Initialize a Firebase app instance

### Create a <i>firebase.js</i> with the following content:

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  //these values are extracted from firebase console
  //the actual values are stored in .env.local
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
```

### Create a <i>useFirebase.js</i> custom hook that handles token generation and notification listener:

```javascript
"use client";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseApp from "./firebase";

const useFirebase = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");
  const [msg, setMsg] = useState({ title: "", body: "" });

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const messaging = getMessaging(firebaseApp);

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID,
            });
            if (currentToken) {
              setToken(currentToken);

              onMessage(messaging, (notification) => {
                console.log("Message received:", notification);
                // Set the message state or perform any other action
                setMsg(notification.notification);
              });
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
              alert("Test");
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
        setNotificationPermissionStatus("fail");
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus, msg };
};

export default useFirebase;
```

### Fire the custom hook on the page file for it to <i>run</i> and initialize an instance

```javascript
const { fcmToken, msg } = useFirebase();
```
