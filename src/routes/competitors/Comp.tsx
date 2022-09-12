import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { h } from "preact";
import { Fragment } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Page } from "../../components/page/Page";
import { db } from "../../util/firebase-config";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import { Field, Form, Formik } from "formik";
import PriBtn from "../../components/generic/PriBtn";
import SecBtn from "../../components/generic/SecBtn";
import CloseIcon from "@mui/icons-material/Close";
import { capitalizeFirstLetter } from "../../util/formatters";

export default function Comp({ seriesId, compId }) {
  const seriesRef = doc(db, "series", seriesId);
  const compsRef = collection(seriesRef, "comps");
  const compDoc = doc(compsRef, compId);
  const [comp, compLoading] = useDocumentData(compDoc);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = async ({ target }) => {
    // const obj[target.name] = target.value
    const update = await updateDoc(compDoc, { [target.name]: target.value });
  };

  const submitModal = async (e) => {
    // console.log("e: ", e);
    await updateDoc(compDoc, { [e.field]: e.val });
    onClose();
  };

  return (
    <Page>
      {compLoading ? (
        <Fragment>
          <Heading mx={4} color="transparent" fontSize={"4xl"}>
            {" "}
            h
          </Heading>
          <Divider border="4px" my={4} />
          <Progress size="xs" isIndeterminate top={-4} />
        </Fragment>
      ) : (
        comp && (
          <Fragment>
            <Flex mt={6} mx={2} gap={2} justifyContent="space-between">
              <Heading mx={4} color="blue.400" fontSize={"4xl"}>
                {comp?.boat}
              </Heading>
              <Flex gap={2} mr={4}>
                <ToolIconBtn
                  label="Back"
                  action={() => history.back()}
                  icon={ArrowBackIcon}
                />
                <ToolIconBtn
                  label="Add field"
                  action={onOpen}
                  icon={AddToPhotosOutlinedIcon}
                />
              </Flex>
            </Flex>
            <Divider border="4px" my={4} />
            <Grid
              templateColumns="repeat(6, 1fr)"
              color={useColorModeValue("blue.500", "blue.300")}
              maxWidth={540}
              gap={2}
              fontSize="lg"
              mx={4}
            >
              {Object.keys(comp)
                .sort()
                .map((c) => {
                  if (comp[c] === "0") return;
                  if (c === "_seriesid" || c === "compid" || c === "id") return;
                  return (
                    <Fragment>
                      <GridItem textAlign="end">
                        <Text fontWeight="semibold" pt="2px">
                          {capitalizeFirstLetter(c)}:
                        </Text>
                      </GridItem>
                      <GridItem textAlign="left" colSpan={2}>
                        <Editable
                          defaultValue={comp[c]}
                          justifyContent="center"
                        >
                          <EditablePreview />
                          <EditableInput onBlur={handleChange} name="rating" />
                        </Editable>
                      </GridItem>
                    </Fragment>
                  );
                })}

              <GridItem textAlign="right">
                <Text fontWeight="semibold" pt="2px">
                  Fleet:
                </Text>
              </GridItem>
              <GridItem textAlign="left" colSpan={2}>
                <Editable
                  defaultValue={
                    comp?.fleet || comp?.division
                      ? comp.fleet || comp.division
                      : "---"
                  }
                >
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="fleet" />
                </Editable>
              </GridItem>

              {/* <GridItem textAlign="right">
                <Text fontWeight="semibold" pt="2px">
                  Class:
                </Text>
              </GridItem>
              <GridItem textAlign="left" colSpan={2}>
                <Editable defaultValue={comp?.class ? comp.class : "---"}>
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="model" />
                </Editable>
              </GridItem>

              <GridItem textAlign="right">
                <Text fontWeight="semibold" pt="2px">
                  LOA:
                </Text>
              </GridItem>
              <GridItem textAlign="left" colSpan={2}>
                <Editable defaultValue={comp?.loa ? comp.loa : "---"}>
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="loa" />
                </Editable>
              </GridItem>

              <GridItem textAlign="right">
                <Text fontWeight="semibold" pt="2px">
                  Skipper:
                </Text>
              </GridItem>
              <GridItem textAlign="left" colSpan={2}>
                <Editable defaultValue={comp?.helmname ? comp.helmname : "---"}>
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="helmname" />
                </Editable>
              </GridItem>

              <GridItem textAlign="right">
                <Text fontWeight="semibold" pt="2px">
                  Sail No:
                </Text>
              </GridItem>
              <GridItem textAlign="left" colSpan={2}>
                <Editable defaultValue={comp?.sailno ? comp.sailno : "---"}>
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="sailno" />
                </Editable>
              </GridItem> */}
            </Grid>
          </Fragment>
        )
      )}
      <Fragment>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bgColor={useColorModeValue("blue.200", "blue.800")}>
              Add Field
            </ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                field: "",
                val: "",
              }}
              onSubmit={submitModal}
            >
              <Form>
                <ModalBody>
                  <FormLabel htmlFor="field">Field:</FormLabel>
                  <Field as={Input} name="field" />
                  <FormLabel htmlFor="val">Value:</FormLabel>
                  <Field as={Input} name="val" />
                </ModalBody>

                <ModalFooter>
                  <Flex gap={2} w="100%">
                    <PriBtn type="submit" w="100%">
                      Submit
                    </PriBtn>
                    <ToolIconBtn
                      label="CLose"
                      action={onClose}
                      icon={CloseIcon}
                    />
                  </Flex>
                </ModalFooter>
              </Form>
            </Formik>
          </ModalContent>
        </Modal>
      </Fragment>
    </Page>
  );
}
