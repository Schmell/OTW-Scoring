import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../util/firebase-config";
import Footer from "./footer";
import Header from "./header";
import SidebarWithHeader from "./header/SidebarWithHeader";
import Routing from "./Routing";
import { colors } from "./theme";

const theme = extendTheme({ colors });

const App: FunctionalComponent = () => {
  const [user, loading, error] = useAuthState(auth);

  // if (!user) return null;
  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  // I would like to have routes nested with AuthRoute
  // I would like to keep urls clean and be able to pass refs
  return (
    <ChakraProvider resetCSS theme={theme}>
      {/* <div id="preact_root">
        <Header headerTitle={headerTitle} />
        <div class="page">
          <Routing user={user} setHeaderTitle={setHeaderTitle} />
        </div>
        <Footer />
      </div> */}
      <SidebarWithHeader>
        <div class="page">
          <Routing user={user} setHeaderTitle={setHeaderTitle} />
        </div>
      </SidebarWithHeader>
    </ChakraProvider>
  );
};

export default App;
