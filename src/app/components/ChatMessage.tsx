//firebase
import { auth } from "../firebase/firebase";
import { Timestamp } from "firebase/firestore";

//react-firebase-hooks
import { useAuthState } from "react-firebase-hooks/auth";

//font-awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";

//next-js
import Image from "next/image";

type ChatMessageProps = {
  text: string;
  photoURL?: string;
  userID?: string;
  isPending: boolean;
  createdAt?: Timestamp;
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  photoURL = "",
  text,
  userID,
  isPending,
  createdAt,
}) => {
  const [user] = useAuthState(auth);

  const friendlyDateFormat = createdAt
    ?.toDate()
    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const isMessageOwner = userID === user?.uid;
  return (
    <div
      className={`flex items-center gap-1 ${
        isMessageOwner ? "justify-end" : "justify-start"
      } `}
    >
      <Image
        src={photoURL}
        width={28}
        height={28}
        className="rounded-full"
        alt="user"
      />
      <div
        className={`px-3 rounded-xl flex items-end gap-1.5 ${
          isMessageOwner ? "bg-blue-400" : "bg-white border-gray-400 border"
        }`}
      >
        <p className="py-1">{text}</p>
        {isPending && (
          <div className="ml-auto">
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="text-xs text-gray-600"
            />
          </div>
        )}
        {createdAt ? (
          <p className="text-xs text-gray-600 text-end">{friendlyDateFormat}</p>
        ) : null}
      </div>
    </div>
  );
};
export default ChatMessage;
