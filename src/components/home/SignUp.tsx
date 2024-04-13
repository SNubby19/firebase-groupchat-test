import { FormEvent, useState } from "react";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorStat, setErrorStat] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const userId = auth.currentUser?.uid as string;
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, {
          uid: userId,
          groupChats: [],
          createdAt: Timestamp.now(),
        });

        navigate("/chats");
      })
      .catch((error: FirebaseError) => {
        setErrorStat(true);

        let errstr: string = error.code;
        console.log(error);
        errstr = errstr.split("/")[1].split("-").join(" ");

        setErrorMessage(errstr);

        setEmail("");
        setPassword("");
      });
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" marginTop={2}>
            Sign Up!
          </Button>
        </form>
        {errorStat && <Text>{errorMessage}</Text>}
      </Flex>
    </>
  );
};

export default SignUp;
