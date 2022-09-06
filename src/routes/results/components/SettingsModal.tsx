import { chakra, Box, Flex, Stack, HStack, Divider } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useRadio, useColorModeValue } from "@chakra-ui/react";
import { Fragment, h } from "preact";
import { StateUpdater, useEffect } from "preact/hooks";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../util/firebase-config";
import { Field, Form, Formik } from "formik";
import useStorage from "../../../hooks/useStorage";

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
        <ModalHeader bgColor={useColorModeValue("blue.200", "blue.800")}>
          Settings
        </ModalHeader>
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
                {({ field, form, values }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel htmlFor="rowTitle">Row Title</FormLabel>

                    <RadioGroup
                      {...field}
                      id="rowTitle"
                      onChange={(val) => {
                        setResultType(resultType);
                        setRowTitle(val);
                        handleSubmit(values);
                      }}
                      value={rowTitle}
                    >
                      <HStack>
                        <Field
                          type="radio"
                          name="rowTitle"
                          value="boat"
                          as={Radio}
                        >
                          Boat
                        </Field>
                        <Field
                          type="radio"
                          name="rowTitle"
                          value="helmname"
                          as={Radio}
                        >
                          Skipper
                        </Field>
                        <Field
                          type="radio"
                          name="rowTitle"
                          value="sailno"
                          as={Radio}
                        >
                          Sail no.
                        </Field>
                      </HStack>
                    </RadioGroup>

                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {/*  */}

              <Divider my={3} />

              <Field name="resultType">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.name && form.touched.name}
                  >
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
                        <Field
                          type="radio"
                          name="resultType"
                          value="points"
                          as={Radio}
                        >
                          Points
                        </Field>
                        <Field
                          type="radio"
                          name="resultType"
                          value="elapsed"
                          as={Radio}
                        >
                          Elapsed
                        </Field>
                        <Field
                          type="radio"
                          name="resultType"
                          value="corrected"
                          as={Radio}
                        >
                          Corrected
                        </Field>
                        <Field
                          type="radio"
                          name="resultType"
                          io
                          value="finish"
                          as={Radio}
                        >
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
                <Button
                  type="submit"
                  variant="outline"
                  mr={3}
                  onClick={handleSetForSeries}
                >
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
  const { state, getInputProps, getCheckboxProps, htmlProps, getLabelProps } =
    useRadio(radioProps);
  return (
    <Fragment>
      <chakra.label {...htmlProps} cursor="pointer">
        <Input {...(getInputProps({}) as any)} hidden />
        <Box
          {...(getCheckboxProps() as any)}
          //   variant="outline"
          bg={state.isChecked ? "blue" : "gray"}
        >
          <Box {...(getLabelProps() as any)}>{children}</Box>
        </Box>
      </chakra.label>
    </Fragment>
  );
}
