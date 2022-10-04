import { h } from "preact";
import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import Footer from "../footer";

export const Page = ({ children }) => {
  return (
    <Fragment>
      <Box w="100%" className="page" overflowY={"hidden"}>
        {children}
      </Box>
      {/* <Footer /> */}
    </Fragment>
  );
};
