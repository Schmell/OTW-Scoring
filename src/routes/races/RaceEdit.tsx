import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useState } from "preact/hooks";
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Form, Formik } from "formik";
import { FadeIn, FadeInSlideLeft, FadeInSlideRight } from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { formatDate, formatTime } from "../../util/formatters";
import { Date } from "./raceEdit/Date";
import { FirstGun } from "./raceEdit/FirstGun";
import { Notes } from "./raceEdit/Notes";
import { ResultType } from "./raceEdit/ResultType";
import { Sailed } from "./raceEdit/Sailed";
import { Starts } from "./raceEdit/Starts";
import style from "./style.css";

export const RaceEdit = ({ setHeaderTitle }) => {
  setHeaderTitle("Edit Race");

  interface IraceStarts {
    fleet: string;
    start: string;
  }

  //
  // Get the current navigation id's
  // only need the getters here
  const [raceId] = useStorage("raceId");
  const [seriesId] = useStorage("seriesId");

  // Set state for form values
  // Not sure why these are the only ones i need to set state for
  const [raceTime, setRaceTime] = useState<string>();
  const [raceStarts, setRaceStarts] = useState<IraceStarts[]>();
  const [postponed, setPostponed] = useState<string>("");
  const [postponedDate, setPostponedDate] = useState("");
  const [title, setTitle] = useState("");

  const submittedToast = useToast();

  // Need this for the AddStartModal

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId, "races", raceId);
  const [currentRace, loading, error] = useDocumentData(docRef);

  if (!loading) {
    setRaceTime(formatTime(currentRace?.time));
    setRaceStarts(currentRace?.starts);
    setPostponedDate(currentRace?.postponedDate);
  }

  const submitHandler = async (values: any) => {
    // remove undefined's from values
    Object.keys(values).map((m) => {
      if (values[m] === undefined) return (values[m] = "");
      return values;
    });
    // update the firestore doc
    // here we may need to add modified flag or something
    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Race Updated",
      description: "Your race properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // route back to races
    route("/races");
  };

  return (
    <Fragment>
      <Box>
        {/* Heading */}
        <Flex justifyContent="space-between" alignItems="center" minWidth="max-content" wrap="wrap">
          {/* This is the header with race name or number */}
          <FadeInSlideRight>
            <Heading as="h5" color="blue.400">
              <Editable defaultValue={currentRace?.name ? currentRace.name : `Race ${currentRace?.rank}`}>
                <EditablePreview />
                <EditableInput
                  onChange={({ target }) => {
                    console.log("target: ", target.value);
                    setTitle(target.value);
                  }}
                />
              </Editable>
            </Heading>
          </FadeInSlideRight>

          {/* For Dev purposes only */}
          <FadeInSlideLeft>
            <Text fontSize="sm" color="lightgray">
              id: {currentRace?.raceid} - {currentRace?._seriesid}
            </Text>
          </FadeInSlideLeft>
        </Flex>

        <Divider my={3} />

        {/* Start the form */}
        <FadeIn>
          <Box mx={4}>
            <Formik
              enableReinitialize
              initialValues={{
                resultType: "finish",
                date: formatDate(currentRace?.date),
                sailed: currentRace?.sailed,
                postponed: postponed,
                postponedDate: currentRace?.postponedDate,
                time: raceTime,
                starts: raceStarts,
                notes: currentRace?.notes,
                name: title,
              }}
              onSubmit={submitHandler}
            >
              {({ values }) => (
                <Form className={style.raceform}>
                  {}
                  {/* Result Type */}
                  <ResultType />

                  <Divider my={3} />

                  {/* Date */}
                  <Date />

                  <Divider my={3} />

                  {/* Sailed */}
                  <Sailed
                    postponed={postponed}
                    postponedDate={postponedDate}
                    setPostponedDate={setPostponedDate}
                    currentRace={currentRace}
                  />

                  <Divider my={3} />

                  {/* First gun  */}
                  <FirstGun docRef={docRef} setRaceTime={setRaceTime} />

                  <Divider my={3} />

                  <Starts raceStarts={raceStarts} docRef={docRef} values={values} />

                  {/* Notes */}
                  <Notes loading={loading} currentRace={currentRace} />

                  {/* Submit Button */}
                  <Button type="submit" colorScheme="blue" w="100%" my={4}>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </FadeIn>
      </Box>
    </Fragment>
  );
};
