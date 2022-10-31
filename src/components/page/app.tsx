import { ChakraProvider } from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import SidebarWithHeader from "../header/SidebarWithHeader";
import Routing from "./Routing";
import { theme } from "./theme";

const App = () => {
  const [user] = useAuthState(auth);
  // header title is causing way to much rerendering
  // try to impliment useStorage
  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SidebarWithHeader headerTitle={headerTitle}>
        <Routing
          user={user}
          setHeaderTitle={setHeaderTitle}
          headerTitle={headerTitle}
        />
      </SidebarWithHeader>
    </ChakraProvider>
  );
};

export default App;
