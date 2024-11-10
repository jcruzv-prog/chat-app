//firebase
import { firestore, auth } from "../firebase/firebase";
import { collection, orderBy, limit, query, addDoc } from "firebase/firestore";
import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

//react-firebase-hooks
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

//types
import { ChatMessageData } from "../types/chat-message";

//components
import ChatMessage from "./ChatMessage";

//react
import { useEffect, useState } from "react";

//font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";

//next-js
import Image from "next/image";

// Define un converter para agregar el id al documento
const converter = {
  toFirestore(document: ChatMessageData) {
    return {
      id: document.id,
      text: document.text,
      createdAt: document.createdAt,
      photoURL: document.photoURL,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ChatMessageData {
    const data = snapshot.data(options);
    return {
      text: data.text,
      id: snapshot.id,
      createdAt: data.createdAt,
      photoURL: data.photoURL,
      userID: data.userID,
      isPending: snapshot.metadata.hasPendingWrites,
    };
  },
};

const ChatRoom: React.FC = () => {
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(100)).withConverter(
    converter
  );
  const [messages] = useCollectionData(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [formValue, setFormValue] = useState("");
  const [user] = useAuthState(auth);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue(evt.target.value);
  };

  const scrollToBottom = () => {
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    window.scrollTo({
      top: documentHeight,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (formValue.trim() === "") return;
    const userID = user?.uid;
    const photoURL = user?.photoURL;
    addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      userID,
      photoURL,
    });
    setFormValue("");
  };

  const handleLogout = () => {
    signOut(auth);
  };
  console.log(messages);
  const photoURL = user?.photoURL || "";
  const userName = user?.displayName || "Guest";
  return (
    <>
      <div className="bg-gray-300/50 fixed right-4 left-4 top-2 pr-2 py-2 rounded-md backdrop-blur-lg grow flex justify-between px-3">
        <div className="flex items-center gap-2">
          <Image
            src={photoURL}
            className="rounded-full"
            width={28}
            height={28}
            alt="Avatar"
          />
          <p>{userName}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-blue-50 rounded-md flex gap-2 items-center px-3 h-7"
        >
          Sign out
          <FontAwesomeIcon icon={faRightToBracket} className="text-2xl" />
        </button>
      </div>
      <div className="flex flex-col pt-20 px-8 pb-20  w-[90%]">
        <div className="flex flex-col gap-5">
          {messages?.map((message) => {
            const { id, ...messageProps } = message;
            return <ChatMessage {...messageProps} key={id} />;
          })}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 pb-1 w-full flex pl-1"
      >
        <input
          type="text"
          value={formValue}
          onChange={handleChange}
          className="border-2 border-gray-600 grow h-12 pl-4"
        />
        <button type="submit" className="w-20 bg-gray-500">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </>
  );
};

export default ChatRoom;
