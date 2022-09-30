import {
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Progress,
  Text,
} from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Editable, EditableInput, EditablePreview } from "@chakra-ui/react";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import {} from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { useState } from "preact/hooks";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../util/firebase-config";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field, Form, Formik } from "formik";
import PriBtn from "../../components/generic/PriBtn";
import ToolIconBtn from "../../components/generic/ToolIconBtn";
import { capitalizeFirstLetter } from "../../util/formatters";
// Icons
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PageHead from "../../components/page/pageHead";
import { Page } from "../../components/page/Page";

export default function Comp({ seriesId, compId }) {
  const [edit, setEdit] = useState(true);
  const seriesRef = doc(db, "series", seriesId);
  const compsRef = collection(seriesRef, "comps");
  const compDoc = doc(compsRef, compId);
  const [comp, compLoading] = useDocumentData(compDoc);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = async ({ target }) => {
    const update = await updateDoc(compDoc, { [target.name]: target.value });
  };

  const submitModal = async (e) => {
    // console.log("e: ", e);
    await updateDoc(compDoc, { [e.field]: e.val });
    onClose();
  };

  return (
    <Fragment>
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
          <Page>
            {/* <Flex mt={6} mx={2} gap={2} justifyContent="space-between">
              <Heading mx={4} color="blue.400" fontSize={"4xl"}>
                <Editable defaultValue={comp?.boat} justifyContent="center">
                  <EditablePreview />
                  <EditableInput onBlur={handleChange} name="boat" />
                </Editable>
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

            <Divider border="4px" my={4} /> */}
            <PageHead title={comp?.boat} loading={compLoading}>
              <ToolIconBtn
                label="Back"
                action={() => history.back()}
                icon={ArrowBackIcon}
              />
              <ToolIconBtn
                label="Edit"
                action={() => setEdit(!edit)}
                icon={EditIcon}
              />
              <ToolIconBtn
                label="Add field"
                action={onOpen}
                icon={AddToPhotosOutlinedIcon}
              />
            </PageHead>

            <Grid
              templateColumns="repeat(6, 1fr)"
              color={useColorModeValue("blue.500", "blue.300")}
              gap={2}
              fontSize="lg"
              mx={4}
              mt={4}
            >
              {Object.keys(comp)
                .sort()
                .map((c) => {
                  if (comp[c] === "0") return;
                  if (
                    c === "_seriesid" ||
                    c === "compid" ||
                    c === "id" ||
                    c === "boat"
                  )
                    return;

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
                          isDisabled={edit}
                        >
                          <EditablePreview />
                          <EditableInput onBlur={handleChange} name="rating" />
                        </Editable>
                      </GridItem>
                    </Fragment>
                  );
                })}
            </Grid>
          </Page>
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
    </Fragment>
  );
}
