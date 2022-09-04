import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import SidebarWithHeader from "./components/header/SidebarWithHeader";
import Routing from "./components/page/Routing";
import { theme } from "./components/page/theme";
import { auth } from "./util/firebase-config";

export function App() {
  const [user] = useAuthState(auth);

  const [headerTitle, setHeaderTitle] = useState("Blw Me");

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
}

// export default App;
