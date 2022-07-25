import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
  VisuallyHidden,
} from "@chakra-ui/react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field, Form, Formik } from "formik";
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

  const submittedToast = useToast();

  // Need this for the AddStartModal

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId, "races", raceId);
  const [currentRace, loading] = useDocumentData(docRef);
  const [raceName, setRaceName] = useState("");

  if (!loading && currentRace) {
    if (currentRace.time) setRaceTime(formatTime(currentRace.time));

    setRaceStarts(currentRace.starts);
    setPostponedDate(currentRace.postponedDate);
  }

  const submitHandler = async (values: any) => {
    // remove undefined's from values
    Object.keys(values).map((m) => {
      if (values[m] === undefined) return (values[m] = "");
      return values;
    });
    // update the firestore doc
    // here we may need to add modified flag or something

    // const lastMod = {new Date()}
    values.lastModifiedDate = serverTimestamp();
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

  useEffect(() => {
    setRaceName(currentRace?.name ? currentRace.name : `Race ${currentRace?.rank}`);
  }, [loading]);

  return (
    <Fragment>
      {!loading && currentRace && (
        <Formik
          enableReinitialize
          initialValues={{
            resultType: "finish",
            date: formatDate(currentRace.date),
            sailed: currentRace.sailed,
            postponed: postponed,
            postponedDate: currentRace.postponedDate,
            time: raceTime,
            starts: raceStarts,
            notes: currentRace.notes,
            name: raceName,
          }}
          onSubmit={submitHandler}
        >
          {({ values }) => (
            <Form>
              {}
              <Box>
                {/* Heading */}
                <Flex justifyContent="space-between" alignItems="center" minWidth="max-content" wrap="wrap" mx={4}>
                  {/* This is the header with race name or number */}
                  <FadeInSlideRight>
                    <Heading as="h5" color="blue.400">
                      <Editable
                        defaultValue={currentRace?.name ? currentRace.name : `Race ${currentRace?.rank}`}
                        isPreviewFocusable={true}
                      >
                        <EditablePreview />
                        <EditableInput
                          onChange={({ target }) => {
                            setRaceName(target.value);
                          }}
                        />
                      </Editable>
                    </Heading>
                    <Text fontSize="sm" color="lightgray">
                      id: {currentRace?.raceid} - {currentRace?._seriesid}
                    </Text>
                  </FadeInSlideRight>

                  {/* For Dev purposes only */}
                  {/* <FadeInSlideLeft></FadeInSlideLeft> */}
                </Flex>

                <Divider my={3} />

                {/* Start the form */}
                <FadeIn>
                  <Box mx={4}>
                    <VisuallyHidden>
                      <Field name="name"></Field>
                    </VisuallyHidden>
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
                  </Box>
                </FadeIn>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Fragment>
  );
};
