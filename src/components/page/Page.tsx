import { h } from "preact";
import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import Footer from "../footer";

export const Page = ({ children, ...rest }) => {
  return (
    <Fragment>
      <Box w="100%" className="page" overflowY={"hidden"} {...rest}>
        {children}
      </Box>
      {/* <Footer /> */}
    </Fragment>
  );
};
