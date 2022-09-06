import {
  Box,
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { h } from "preact";
import { useState } from "preact/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import SidebarWithHeader from "./components/header/SidebarWithHeader";
import Routing from "./components/page/Routing";
import { components, colors, fonts } from "./components/page/theme";
import { auth } from "./util/firebase-config";

export function App() {
  const [user] = useAuthState(auth);
  // REMOVE FOR PRODUCTION
  const annoyingMessage = document.querySelector(".firebase-emulator-warning");
  annoyingMessage?.remove();

  const [headerTitle, setHeaderTitle] = useState("Blw Me");
  const [userColorScheme, setUserColorScheme] = useState("blue");
  const theme = extendTheme(
    withDefaultColorScheme({ colorScheme: userColorScheme }),
    {
      components,
      colors,
      fonts,
    }
  );

  return (
    <div id="preact_root">
      <ChakraProvider resetCSS theme={theme}>
        <SidebarWithHeader headerTitle={headerTitle}>
          <Box mt={16}>
            <Routing
              user={user}
              setHeaderTitle={setHeaderTitle}
              headerTitle={headerTitle}
              setUserColorScheme={setUserColorScheme}
            />
          </Box>
        </SidebarWithHeader>
      </ChakraProvider>
    </div>
  );
}

// export default App;