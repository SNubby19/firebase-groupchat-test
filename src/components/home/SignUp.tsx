import { useState } from "react";

import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form finished");
    await createUserWithEmailAndPassword(auth, email, password);

    const userId = auth.currentUser?.uid as string;
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, {
      uid: userId,
      groupChats: [],
      createdAt: Timestamp.now(),
    });

    navigate("/chats");
  };

  return (
    <>
      <Flex direction={"column"} align={"start"}>
        <h1>Sign Up</h1>
        <form style={{ marginTop: 25 }} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required={true}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" marginTop={2}>
            Sign Up!
          </Button>
        </form>
      </Flex>
    </>
  );
};

export default SignUp;
