import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../util/firebase-config";
import SidebarWithHeader from "../header/SidebarWithHeader";
import Routing from "./Routing";
import { theme } from "./theme";

const App = () => {
  const [user] = useAuthState(auth);

  const [headerTitle, setHeaderTitle] = useState("Blw Me");
  // remove annoying firebase message
  document?.querySelector(".firebase-emulator-warning")?.remove();
  return (
    <div id="preact_root">
      <ChakraProvider resetCSS theme={theme}>
        <SidebarWithHeader headerTitle={headerTitle}>
          <Box mt={16}>
            <Routing
              user={user}
              setHeaderTitle={setHeaderTitle}
              headerTitle={headerTitle}
            />
          </Box>
        </SidebarWithHeader>
      </ChakraProvider>
    </div>
  );
};

export default App;
