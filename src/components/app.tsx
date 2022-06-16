import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../util/firebase-config";
import SidebarWithHeader from "./header/SidebarWithHeader";
import Routing from "./Routing";
import { colors } from "./theme";

const theme = extendTheme({ colors });

const App: FunctionalComponent = () => {
  const [user, userLoading, userError] = useAuthState(auth);

  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SidebarWithHeader headerTitle={headerTitle}>
        <div class="page">
          <Routing user={user} setHeaderTitle={setHeaderTitle} />
        </div>
      </SidebarWithHeader>
    </ChakraProvider>
  );
};

export default App;
