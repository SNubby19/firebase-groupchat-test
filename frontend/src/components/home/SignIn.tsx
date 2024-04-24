import { FormControl, FormLabel, Input, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase";

function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form finished");
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setErrorMessage("");
        navigate("/chats");
      })
      .catch((error) => {
        const errorCode = error.code.replace("auth/", "");
        setErrorMessage(errorCode);
      });
  };
  return (
    <>
      <Flex direction={"column"} align={"start"}>
        <h1>Sign In</h1>
        <form style={{ marginTop: 25 }} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              onChange={(e) => {
                e.preventDefault();
                return setEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => {
                e.preventDefault();
                return setPassword(e.target.value);
              }}
            />
          </FormControl>
          <p style={{ color: "red" }}>{errorMessage}</p>
          <Button type="submit" marginTop={2}>
            Sign In!
          </Button>
        </form>
      </Flex>
    </>
  );
}

export default SignIn;
