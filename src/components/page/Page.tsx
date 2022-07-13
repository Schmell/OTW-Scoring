import { h } from "preact";
import { Box } from "@chakra-ui/react";

export const Page = ({ children }) => {
  return <Box className="page">{children}</Box>;
};
