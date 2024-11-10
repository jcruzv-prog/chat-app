import { Timestamp } from "firebase/firestore";

export type ChatMessageData = {
  id: string;
  text: string;
  createdAt?: Timestamp;
  photoURL?: string;
  userID?: string;
  isPending: boolean;
};
