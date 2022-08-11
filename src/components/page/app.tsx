import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import SidebarWithHeader from "../header/SidebarWithHeader";
import Routing from "./Routing";
import { colors, components } from "./theme";

const App = () => {
  const theme = extendTheme({ colors: colors, components: components });
  const [user] = useAuthState(auth);

  const [headerTitle, setHeaderTitle] = useState("Blw Me");

  return (
    <div id="preact_root">
      <ChakraProvider resetCSS theme={theme}>
        <SidebarWithHeader headerTitle={headerTitle}>
          <Box mt={16}>
            <Routing user={user} setHeaderTitle={setHeaderTitle} />
          </Box>
        </SidebarWithHeader>
      </ChakraProvider>
    </div>
  );
};

export default App;
