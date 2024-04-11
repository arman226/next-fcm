"use client";
import useFirebase from "./useFirebase";
export default function Home() {
  const { fcmToken, msg } = useFirebase();

  return (
    <div>
      <p>{fcmToken}</p>
      <p>TITLE: {msg.title}</p>
      <p>BODY: {msg.body}</p>
    </div>
  );
}
