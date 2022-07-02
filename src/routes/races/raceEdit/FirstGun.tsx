import { Box, Button, FormLabel, Input } from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import { updateDoc } from "firebase/firestore";
import { Field } from "formik";
import { Fragment, h } from "preact";
import SecBtn from "../../../components/generic/SecBtn";

export const FirstGun = ({ docRef, setRaceTime }) => {
  const handleSetTime = async () => {
    const theDate = Temporal.Now.plainTimeISO();
    await updateDoc(docRef, { time: `${theDate.round("minutes")}` });
    setRaceTime(`${theDate.round("minutes")}`);
  };

  return (
    <Fragment>
      <FormLabel htmlFor="time">First gun</FormLabel>
      <Box d="flex" justifyContent="space-between">
        {/* Need to get seconds here */}
        <Field name="time" type="time" step="2" as={Input} border="none" />
        <SecBtn px={8} ml={4} onClick={handleSetTime}>
          Now
        </SecBtn>
      </Box>
    </Fragment>
  );
};
