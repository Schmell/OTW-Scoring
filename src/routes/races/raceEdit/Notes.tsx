import { FormLabel, Textarea } from "@chakra-ui/react";
import { Field } from "formik";
import { Fragment, h } from "preact";

export const Notes = ({ loading, currentRace }) => {
  return (
    <Fragment>
      <FormLabel htmlFor="notes">Notes</FormLabel>
      <Field name="notes" as={Textarea} rows="4" cols="50">
        {loading ? "loading..." : currentRace?.notes}
      </Field>
    </Fragment>
  );
};
