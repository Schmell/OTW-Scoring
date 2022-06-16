import {
  Box, FormControl, FormLabel, Input
} from "@chakra-ui/react";
import { Field } from "formik";
import { Fragment, h } from "preact";

export const Date = () => {
  return (
    <Fragment>
      <Box>
        <FormControl>
          <FormLabel htmlFor="date">Date: </FormLabel>
          <Field type="date" name="date" as={Input} />
        </FormControl>
      </Box>
    </Fragment>
  );
};
