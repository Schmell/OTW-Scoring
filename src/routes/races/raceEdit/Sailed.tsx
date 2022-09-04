import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { Field } from "formik";
import { Fragment, h } from "preact";
import SecBtn from "../../../components/generic/SecBtn";

interface ISailedProps {
  postponed?: string;
  postponedDate?: any;
  setPostponedDate?: any;
  currentRace?: any;
}

export const Sailed = ({
  postponedDate,
  setPostponedDate,
  currentRace,
}: ISailedProps) => {
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
                  {postponedDate ? (
                    <Fragment>
                      <Field
                        name="postponedDate"
                        type="datetime-local"
                        variant="ghost"
                        as={Input}
                      >
                        {currentRace.postponedDate}
                      </Field>

                      <SecBtn
                        ml={3}
                        onClick={(target) => {
                          currentRace.postponedDate = null;
                          setPostponedDate(false);
                        }}
                      >
                        Set as TBA
                      </SecBtn>
                    </Fragment>
                  ) : (
                    <Flex
                      alignItems={"center"}
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Text>TBA</Text>
                      <SecBtn
                        onClick={({ target }) => {
                          currentRace.postponedDate = true;
                          setPostponedDate(true);
                        }}
                      >
                        Set date
                      </SecBtn>
                    </Flex>
                  )}
                  {/*  */}
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
