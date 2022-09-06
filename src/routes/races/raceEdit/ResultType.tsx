import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Field } from "formik";
import { h } from "preact";

export function ResultType() {
  return (
    <Field name="resultType">
      {({ field, form }) => (
        <FormControl isInvalid={form.errors.name && form.touched.name}>
          <FormLabel htmlFor="resultType">Scoring type</FormLabel>
          <RadioGroup {...field} id="resultType" colorScheme="blue">
            <HStack>
              <Field type="radio" name="resultType" value="position" as={Radio}>
                Position
              </Field>
              <Field type="radio" name="resultType" value="elapsed" as={Radio}>
                Elapsed
              </Field>
              <Field type="radio" name="resultType" value="finish" as={Radio}>
                Finishes
              </Field>
            </HStack>
          </RadioGroup>
          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
}
