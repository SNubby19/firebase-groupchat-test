import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";

import Chats from "./pages/chats";
import Home from "./pages/home";
import Chat from "./pages/chat";

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path={`/chats/:chatID`} element={<Chat />} />
          <Route path="/test" element={<Chat />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
