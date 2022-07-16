import { h } from "preact";
import { Box, Container } from "@chakra-ui/react";

export const Page = ({ children }) => {
  return <Container mt={8}>{children}</Container>;
};
