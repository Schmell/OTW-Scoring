import { h } from "preact";
import { Button, ButtonProps, useColorMode } from "@chakra-ui/react";
import MdDarkModeIcon from "@mui/icons-material/DarkMode";
import MdLightModeIcon from "@mui/icons-material/LightMode";
import SecBtn from "./SecBtn";

export default function ColorModeToggle(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      // aria-label="Toggle Color Mode"
      onClick={toggleColorMode}
      _focus={{ boxShadow: "none" }}
      width="fit-content"
      {...props}
    >
      {colorMode === "light" ? <MdDarkModeIcon /> : <MdLightModeIcon />}
    </Button>
  );
}
