import { signOut } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";

import ChatsList from "../../components/chats/ChatsList";

const Chats = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await signOut(auth);

    navigate("/");
  };

  return (
    <>
      {user ? (
        <>
          <ChatsList />
          <a onClick={handleSignOut}>Sign Out</a>
        </>
      ) : (
        <div>
          <h1>No Hello</h1> <a href="/">Sign in here</a>
        </div>
      )}
    </>
  );
};

export default Chats;
