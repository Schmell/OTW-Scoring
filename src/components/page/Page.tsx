import { h } from "preact";
import { Box, Container } from "@chakra-ui/react";

export const Page = ({ children }) => {
  return <Box mt={14}>{children}</Box>;
};
