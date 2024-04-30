import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
// import { httpsCallable } from "firebase/functions";
import React, { useState } from "react";

import { auth /*functions*/ } from "../../firebase";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const CreateChat: React.FC<CustomModalProps> = ({ isOpen, onClose }) => {
  const [chatName, setChatName] = useState<string>("");
  const { value, options, onChange } = useMultiSelect({
    value: [],
    options: [],
  });

  const customOnChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setChatName(e.target.value);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const emails = options.map((elem) => elem.value);
    const chatID = generateRandomString();

    const groupchatData = {
      chatName,
      chatID,
      emails,
      creatorEmail: auth.currentUser?.email,
      creatorID: auth.currentUser?.uid,
      adminIDs: [auth.currentUser?.uid],
    };
    onClose();

    options.length = 0;
    if (typeof value === "string") {
      value.replace(value, "");
    } else if (Array.isArray(value)) {
      value.length = 0;
    } else {
      console.log("value is undefined, can't clear list");
    }

    // const createNewGC = httpsCallable(functions, "createNewGC");

    // createNewGC({ ...groupchatData })
    //   .then((result) => {
    //     console.log(JSON.stringify(result));
    //   })
    //   .catch((error) => {
    //     console.log(error.code);
    //     console.log(error.message);
    //     console.log(error.details);
    //   });

    const apiURL =
      "https://us-central1-uinsports-mobile-app.cloudfunctions.net/createNewGC";

    fetch(apiURL, {
      method: "POST",
      body: JSON.stringify(groupchatData),
    })
      .then((result) => {
        console.log(JSON.stringify(result));
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        console.log(error.details);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <FormLabel htmlFor="name">Group Chat Name</FormLabel>
              <Input
                placeholder="Groupchat Name"
                type="input"
                onChange={customOnChange}
                required={true}
              />
            </FormControl>

            <FormControl>
              <MultiSelect
                options={options}
                value={value}
                label="Emails of Friends you want to add"
                onChange={onChange}
                placeholder="Emails"
                create
              />
            </FormControl>
            <Button type="submit" onClick={handleSubmit}>
              Create New Chat!
            </Button>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChat;
