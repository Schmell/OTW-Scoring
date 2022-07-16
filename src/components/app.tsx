import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { FunctionalComponent, h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../util/firebase-config";
import SidebarWithHeader from "./header/SidebarWithHeader";
import Routing from "./Routing";
import { colors, components } from "./theme";

const App: FunctionalComponent = () => {
  const theme = extendTheme({ colors, components });
  const [user, userLoading, userError] = useAuthState(auth);

  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  return (
    <ChakraProvider resetCSS theme={theme}>
      <SidebarWithHeader headerTitle={headerTitle}>
        <Container className="page">
          <Routing user={user} setHeaderTitle={setHeaderTitle} />
        </Container>
      </SidebarWithHeader>
    </ChakraProvider>
  );
};

export default App;
