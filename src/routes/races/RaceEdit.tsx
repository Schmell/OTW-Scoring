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
  VisuallyHidden,
} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { route } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field, Form, Formik } from "formik";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import useStorage from "../../hooks/useStorage";
import { db } from "../../util/firebase-config";
import { formatDate, formatTime } from "../../util/formatters";
import { Date } from "./raceEdit/Date";
import { FirstGun } from "./raceEdit/FirstGun";
import { Notes } from "./raceEdit/Notes";
import { ResultType } from "./raceEdit/ResultType";
import { Sailed } from "./raceEdit/Sailed";
import { Starts } from "./raceEdit/Starts";
import PriBtn from "../../components/generic/PriBtn";
import SecBtn from "../../components/generic/SecBtn";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import CloseIcon from "@mui/icons-material/Close";
import PageHead from "../../components/page/pageHead";
// import style from "./style.css";

export default function RaceEdit({ setHeaderTitle }) {
  setHeaderTitle("Edit Race");

  interface IraceStarts {
    fleet?: string;
    start?: string;
  }

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

  // Get the currentRace data
  const docRef = doc(db, "series", seriesId, "races", raceId);
  const [currentRace, loading] = useDocumentData(docRef);
  const [raceName, setRaceName] = useState("");

  if (!loading && currentRace) {
    if (currentRace.time) setRaceTime(formatTime(currentRace.time));

    setRaceStarts(currentRace.starts);
    setPostponedDate(currentRace.postponedDate);
  }

  const submitHandler = async (values: any, { setSubmitting }) => {
    setSubmitting(true);
    // remove undefined's from values
    Object.keys(values).map((m) => {
      if (values[m] === undefined) return (values[m] = "");
      return values;
    });

    // update the firestore doc
    // here we may need to add modified flag or something
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
    setSubmitting(false);
    // route back to races
    history.back();
    // route("/races");
  };

  useEffect(() => {
    setRaceName(
      currentRace?.name ? currentRace.name : `Race ${currentRace?.rank}`
    );
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
              <Box>
                <PageHead title={currentRace.name}>
                  <Text fontSize="sm" color="lightgray">
                    id: {currentRace?.raceid} - {currentRace?._seriesid}
                  </Text>
                </PageHead>

                {/* Start the form */}
                <FadeIn>
                  <Box mx={4} mt={4}>
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

                    <Starts
                      raceStarts={raceStarts}
                      docRef={docRef}
                      values={values}
                    />

                    {/* Notes */}
                    <Notes loading={loading} currentRace={currentRace} />

                    {/* Submit Button */}
                    <Flex gap={2} my={4} mb={6}>
                      <PriBtn type="submit" width="100%">
                        Submit
                      </PriBtn>
                      <SecBtn type="reset">Reset</SecBtn>
                      <ToolIconBtn
                        label="Close"
                        icon={CloseIcon}
                        action={() => {
                          history.back();
                        }}
                      />
                    </Flex>
                  </Box>
                </FadeIn>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Fragment>
  );
}
