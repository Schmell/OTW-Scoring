import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../util/firebase-config";
import Footer from "./footer";
import Header from "./header";
import Routing from "./Routing";
import { colors } from "./theme";

const theme = extendTheme({ colors });

const App: FunctionalComponent = () => {
  const [user, loading, error] = useAuthState(auth);

  // if (!user) return null;
  const [headerTitle, setHeaderTitle] = useState("Blw Me");
  const [racePath, setRacePath] = useState();

  // I would like to have routes nested with AuthRoute
  // I would like to keep urls clean and be able to pass refs
  return (
    <ChakraProvider resetCSS theme={theme}>
      <div id="preact_root">
        <Header headerTitle={headerTitle} setHeaderTitle={setHeaderTitle} />
        <div class="page">
          <Routing user={user} setHeaderTitle={setHeaderTitle} />
        </div>
        <Footer />
      </div>
    </ChakraProvider>
  );
};

export default App;
