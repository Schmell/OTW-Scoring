import { h } from "preact";
import { Button, ButtonProps, useColorMode } from "@chakra-ui/react";
import MdDarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import MdLightModeIcon from "@mui/icons-material/LightModeOutlined";

export default function ColorModeToggle(props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      aria-label="Toggle Color Mode"
      onClick={toggleColorMode}
      _focus={{ boxShadow: "none" }}
      w="fit-content"
      {...props}
    >
      {colorMode === "light" ? <MdDarkModeIcon /> : <MdLightModeIcon />}
    </Button>
  );
}
