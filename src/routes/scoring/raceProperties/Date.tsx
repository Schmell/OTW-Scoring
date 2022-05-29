import {
  Radio,
  Input,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  RadioGroup,
} from "@chakra-ui/react";
import { style } from "@mui/system";
import { Field } from "formik";
import { Fragment, h } from "preact";

export const Date = () => {
  return (
    <Fragment>
      <Box>
        <FormControl>
          <FormLabel htmlFor="date">Date: </FormLabel>
          <Field type="date" name="date" />
        </FormControl>
      </Box>
    </Fragment>
  );
};
