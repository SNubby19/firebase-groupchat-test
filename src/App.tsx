import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { MultiSelectTheme } from "chakra-multiselect";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const theme = extendTheme({
  components: {
    MultiSelect: MultiSelectTheme,
  },
});

import "./App.css";
import Chats from "./pages/chats";
import Home from "./pages/home";
import Test from "./pages/test";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path={`/chats/:chatID`} element={<Test />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
