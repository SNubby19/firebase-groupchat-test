import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import CreateChat from "./CreateChat";

type GroupchatData = {
  adminIDs: string[];
  chatID: string;
  chatName: string;
  createdAt: Timestamp;
  creatorID: string;
  members: string[];
};

type UserData = {
  createdAt: Timestamp;
  groupChats: string[];
  uid: string;
};

const ChatsList = () => {
  const [joinChatID, setJoinChatID] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const groupChatsRef = collection(db, "groupChats");
  const userRef = doc(db, "users", auth.currentUser?.uid as string);

  const q = query(groupChatsRef, orderBy("createdAt", "desc"));

  const [gcS] = useCollectionData(q);
  const [userData] = useDocumentData<DocumentData | UserData>(userRef);

  const joinGC = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setJoinChatID("");

    const q = query(
      collection(db, "groupChats"),
      where("chatID", "==", joinChatID)
    );
    const userRef = doc(db, "users", auth.currentUser?.uid as string);

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("This groupchat doesn't exist, please try another code");
    } else {
      await updateDoc(userRef, {
        groupChats: arrayUnion(joinChatID),
      });

      if (
        querySnapshot.docs[0]
          .data()
          .pendingUsers.includes(auth.currentUser?.email)
      ) {
        console.log("updating user info");

        await updateDoc(querySnapshot.docs[0].ref, {
          pendingUsers: arrayRemove(auth.currentUser?.email),
          members: arrayUnion(auth.currentUser?.uid),
        });
      }
    }
  };

  return (
    <>
      <Flex direction={"column"}>
        <h1>Your Chats</h1>
        <Flex
          direction={"row"}
          gap={25}
          justifyContent={"center"}
          margin={15}
          width={"100%"}
        >
          <Button onClick={onOpen}>
            <AddIcon boxSize={4} />
            Create Groupchat
          </Button>
          <CreateChat isOpen={isOpen} onClose={onClose} />
          <InputGroup maxWidth={"35%"}>
            <InputRightElement>
              <IconButton
                aria-label="join group chat"
                icon={<SearchIcon color="black" />}
                onClick={joinGC}
              />
            </InputRightElement>
            <Input
              type={"text"}
              value={joinChatID}
              onChange={(e) => setJoinChatID(e.target.value)}
              placeholder="Enter Group Chat ID..."
            />
          </InputGroup>
        </Flex>
      </Flex>
      <Flex direction={"column"}>
        {gcS && userData ? (
          gcS.map(
            (gc: DocumentData | GroupchatData) =>
              userData.groupChats.includes(gc.chatID) && (
                <Card
                  key={gc.chatID}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/chats/${gc.chatID}`);
                  }}
                >
                  {gc.chatName}
                </Card>
              )
          )
        ) : (
          <h3>You have no groupchats</h3>
        )}
      </Flex>
    </>
  );
};

export default ChatsList;
