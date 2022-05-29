import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  HStack,
  Radio,
  Flex,
  Input,
  Button,
  FormErrorMessage,
  Divider,
} from "@chakra-ui/react";
import { Field } from "formik";
import { Fragment, h } from "preact";

interface ISailedProps {
  postponed?: string;
  postponedDate?: any;
}

export const Sailed = ({ postponedDate }: ISailedProps) => {
  return (
    <Box>
      <Field name="sailed">
        {({ field, form }) => (
          <FormControl isInvalid={form.errors.name && form.touched.name}>
            <FormLabel htmlFor="sailed">Sailed</FormLabel>
            <RadioGroup {...field} id="sailed" colorScheme="blue">
              <HStack>
                <Field type="radio" name="sailed" value="1" as={Radio}>
                  Sailed
                </Field>
                <Field type="radio" name="sailed" value="cancelled" as={Radio}>
                  Cancelled
                </Field>
                <Field type="radio" name="sailed" value="postponed" as={Radio}>
                  Postponed
                </Field>
                <Field type="radio" name="sailed" value="0" as={Radio}>
                  Un-sailed
                </Field>
              </HStack>
            </RadioGroup>
            {field.value === "postponed" && (
              <Fragment>
                <Divider mt={3} />
                <FormLabel htmlFor="postponedDate" mt={3}>
                  Postponed Date
                </FormLabel>
                <Flex alignItems="center">
                  <Field
                    name="postponedDate"
                    type="datetime-local"
                    variant="ghost"
                    as={Input}
                    onChange={() => {
                      //   setPostponedDate();
                    }}
                  >
                    {postponedDate}
                  </Field>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    boxShadow="md"
                    ml={3}
                    onClick={(e) => {
                      console.log(e);
                    }}
                  >
                    Set as TBA
                  </Button>
                </Flex>
              </Fragment>
            )}
            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </Box>
  );
};
