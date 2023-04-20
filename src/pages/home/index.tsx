import { Button, Text, Flex } from "@chakra-ui/react";

import SignUp from "../../components/home/SignUp";
import SignIn from "../../components/home/SignIn";

const Home = () => {
  return (
    <>
      <Flex direction="row" gap={25}>
        <SignUp />
        <SignIn />
      </Flex>
    </>
  );
};

export default Home;
