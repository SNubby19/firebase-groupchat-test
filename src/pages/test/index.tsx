import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  useCollection,
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";

import { Flex } from "@chakra-ui/react";

function Test() {
  const { chatID } = useParams();
  const messagesRef = collection(
    db,
    "groupChats",
    chatID as string,
    "messages"
  );
  const q = query(messagesRef, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(q /*, { idField: "id" }*/);
  const [message, setMessage] = useState("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    const { uid } = auth.currentUser as User;
    e.preventDefault();

    setMessage("");
    await addDoc(messagesRef, {
      message,
      createdAt: Timestamp.now(),
      uid,
    });
  };

  return (
    <>
      <main>
        <Flex direction={"column"}>
          {messages &&
            messages.map((msg) => (
              <p
                key={msg.id}
                style={{
                  alignSelf:
                    msg.uid === auth.currentUser?.uid ? "end" : "start",
                }}
              >
                {msg.message}
              </p>
            ))}
        </Flex>
      </main>

      <form onSubmit={sendMessage}>
        <Flex direction={"row"}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="say something nice"
          />

          <button type="submit" disabled={!message}>
            🕊️
          </button>
        </Flex>
      </form>
    </>
  );
}

export default Test;
