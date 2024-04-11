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
