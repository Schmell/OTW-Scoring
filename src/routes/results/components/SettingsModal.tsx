import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  RadioGroup,
  Stack,
  Radio,
  Divider,
  ModalFooter,
  Button,
  useRadio,
  chakra,
  Box,
  Image,
  Input,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { Fragment, h } from "preact";
import { StateUpdater, useEffect } from "preact/hooks";
import useStorage from "../../../hooks/useStorage";
import { db } from "../../../util/firebase-config";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setRowTitle: StateUpdater<string>;
  setResultType: StateUpdater<string>;
  rowTitle: string;
  resultType: string;
}

export default function SettingsModal({
  isOpen,
  onClose,
  setRowTitle,
  rowTitle,
  setResultType,
  resultType,
}: SettingsModalProps) {
  const [seriesId] = useStorage("seriesId");
  //
  const handleSetForSeries = ({ target }) => {
    //
    console.log("target: ", target);
  };

  const handleSubmit = async (values) => {
    const seriesRef = doc(db, "series", seriesId);
    await updateDoc(seriesRef, values);
    console.log(values);
    setRowTitle(values.rowTitle);
    setResultType(values.resultType);
  };

  useEffect(() => {}, [resultType, rowTitle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bgColor={useColorModeValue("blue.200", "blue.800")}>Settings</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            rowTitle: rowTitle,
            resultType: resultType,
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <ModalBody>
              <Field name="rowTitle">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="rowTitle">Row Title</FormLabel>

                    <RadioGroup
                      {...field}
                      id="rowTitle"
                      onChange={(val) => {
                        console.log("resultType: ", resultType);
                        setResultType(resultType);
                        setRowTitle(val);
                      }}
                      value={rowTitle}
                    >
                      <Stack direction="row">
                        <Field type="radio" name="rowTitle" value="boat" as={Radio}>
                          Boat
                        </Field>
                        <Field type="radio" name="rowTitle" value="helmname" as={Radio}>
                          Helm
                        </Field>
                        <Field type="radio" name="rowTitle" value="sailno" as={Radio}>
                          SailNo.
                        </Field>
                      </Stack>
                    </RadioGroup>

                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {/*  */}

              <Divider my={3} />

              <Field name="resultType">
                {({ field, form }) => (
                  <FormControl isInvalid={form.errors.name && form.touched.name}>
                    <FormLabel htmlFor="resultType">View Column</FormLabel>

                    <RadioGroup
                      {...field}
                      id="resultType"
                      onChange={(val) => {
                        setRowTitle(rowTitle);
                        setResultType(val);
                      }}
                      value={resultType}
                    >
                      <Stack direction="row">
                        <Field type="radio" name="resultType" value="points" as={Radio}>
                          Points
                        </Field>
                        <Field type="radio" name="resultType" value="elapsed" as={Radio}>
                          Elapsed
                        </Field>
                        <Field type="radio" name="resultType" value="corrected" as={Radio}>
                          Corrected
                        </Field>
                        <Field type="radio" name="resultType" io value="finish" as={Radio}>
                          Finish
                        </Field>
                      </Stack>
                    </RadioGroup>

                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </ModalBody>

            <ModalFooter>
              <Flex>
                <Button type="submit" colorScheme="blue" variant="outline" mr={3}>
                  Set for Series
                </Button>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </Flex>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
}

function RadioButton(props) {
  const { value, children, ...radioProps } = props;
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } = useRadio(radioProps);
  return (
    <Fragment>
      <chakra.label {...htmlProps} cursor="pointer">
        <Input {...getInputProps({})} hidden />
        <Box
          {...getCheckboxProps()}
          //   variant="outline"
          bg={state.isChecked ? "blue" : "gray"}
        >
          <Box {...getLabelProps()}>{children}</Box>
        </Box>
      </chakra.label>
    </Fragment>
  );
}
