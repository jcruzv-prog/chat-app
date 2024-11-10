"use client";

//styles
// import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

//components
import SignIn from "./components/SignIn";
import ChatRoom from "./components/ChatRoom";

//firebase
import { auth } from "./firebase/firebase";

//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";
export default function Home() {
  const [user] = useAuthState(auth);
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>{user ? <ChatRoom /> : <SignIn />}</main>
    </div>
  );
}
