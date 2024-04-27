import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  orderBy,
  query,
} from "firebase/firestore";
import { useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Flex } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

function Chat() {
  const { chatID } = useParams();
  const [user] = useAuthState(auth);
  const messagesRef = collection(
    db,
    "groupChats",
    chatID as string,
    "messages"
  );
  const q = query(messagesRef, orderBy("createdAt"));

  const [messages] = useCollectionData(q /*, { idField: "id" }*/);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  return user ? (
    <Flex
      direction={"column"}
      justifyContent={"space-between"}
      height={"85vh"}
      width={"85vw"}
    >
      <Button alignSelf={"start"} onClick={() => navigate("/chats")}>
        Back
      </Button>

      <Flex
        direction={"column"}
        justifyContent={"flex-end"}
        gap={5}
        height={"90%"}
      >
        <Flex
          direction={"column"}
          width={"50%"}
          height={"95%"}
          overflow={"auto"}
          alignSelf={"center"}
        >
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

        <form
          onSubmit={sendMessage}
          style={{
            alignSelf: "center",
            width: "50%",
          }}
        >
          <Flex>
            <input
              value={message}
              style={{
                justifySelf: "flex-start",
                borderWidth: 2,
                borderColor: "black",
                borderRadius: 10,
                paddingLeft: 5,
                paddingTop: 5,
                paddingBottom: 5,
                flexGrow: 10,
              }}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="say something nice"
            />

            <button
              type="submit"
              style={{ flexGrow: 1, justifySelf: "flex-end" }}
              disabled={!message}
            >
              🚽
            </button>
          </Flex>
        </form>
      </Flex>
    </Flex>
  ) : (
    <div>
      <h1>No Hello</h1> <a href="/">Sign in here</a>
    </div>
  );
}

export default Chat;
