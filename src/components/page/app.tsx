import { ChakraProvider } from "@chakra-ui/react";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
// import setupIndexedDB from "use-indexeddb";
import { auth } from "../../util/firebase-config";
// import { idbConfig } from "../../util/idbConfig";
import SidebarWithHeader from "../header/SidebarWithHeader";
import Routing from "./Routing";
import { theme } from "./theme";

const App = () => {
  const [user, userLoading, userError] = useAuthState(auth);
  // header title is causing way to much rerendering
  // try to impliment useStorage
  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SidebarWithHeader headerTitle={headerTitle}>
        {!userLoading && (
          <Routing
            user={user}
            uid={user?.uid}
            userLoading={userLoading}
            setHeaderTitle={setHeaderTitle}
            headerTitle={headerTitle}
          />
        )}
      </SidebarWithHeader>
    </ChakraProvider>
  );
};

export default App;
