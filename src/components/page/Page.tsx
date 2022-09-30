import { h } from "preact";
import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import Footer from "../footer";

export const Page = ({ children }) => {
  return (
    <Fragment>
      <Box w="100%" position="absolute" overflow="scroll">
        {children}
      </Box>
      <Footer />
    </Fragment>
  );
};
