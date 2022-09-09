import { Fragment, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import { auth, db } from "../../util/firebase-config";

export default function UserSettings() {
  const submittedToast = useToast();
  const [user, userLoading] = useAuthState(auth);
  const docRef = doc(db, "user", user!.uid); // bang
  const [value, loading, error, snapshot] = useDocumentData(docRef);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading && value) {
      console.log("value.preffersDark: ", value.preffersDark);
      console.log("checked: ", checked);
      setChecked(value.preffersDark);
    }
  }, []);

  const submitHandler = async (values: any) => {
    console.log("values: ", values);
    // remove undefined's from values
    Object.keys(values).map((m) => {
      if (values[m] === undefined) return (values[m] = "");
      return values;
    });
    // update the firestore doc
    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Settings Updated",
      description: "Your setting properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // route back
    history.back();
  };

  return (
    <>
      <Container>
        <FadeInSlideRight>
          <Heading color="blue.400" w="100%" mt={2} pb={3}>
            Settings
          </Heading>
        </FadeInSlideRight>
        <FadeIn>
          <Box mx={4}>
            <Formik
              enableReinitialize
              initialValues={{
                defaultResultType: value?.defaultResultType,
                preffersDark: checked,
              }}
              onSubmit={submitHandler}
            >
              <Form>
                <Field name="defaultResultType">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel htmlFor="defaultResultType">
                        Default scoring type
                      </FormLabel>
                      <RadioGroup
                        {...field}
                        id="defaultResultType"
                        colorScheme="blue"
                      >
                        <HStack>
                          <Field
                            type="radio"
                            name="defaultResultType"
                            value="position"
                            as={Radio}
                          >
                            Position
                          </Field>
                          <Field
                            type="radio"
                            name="defaultResultType"
                            value="elapsed"
                            as={Radio}
                          >
                            Elapsed
                          </Field>
                          <Field
                            type="radio"
                            name="defaultResultType"
                            value="finish"
                            as={Radio}
                          >
                            Finishes
                          </Field>
                        </HStack>
                      </RadioGroup>
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Divider mt={4} />

                <FormLabel htmlFor="preffersDark">Preffer Dark mode</FormLabel>
                <Field
                  name="preffersDark"
                  type="switch"
                  as={Switch}
                  isChecked={checked}
                  onChange={({ target }) => {
                    setChecked(() => {
                      if (checked) return false;
                      return true;
                    });
                  }}
                ></Field>

                <Button type="submit" colorScheme="blue" w="100%" my={4}>
                  Submit
                </Button>
              </Form>
            </Formik>
          </Box>
        </FadeIn>
      </Container>
    </>
  );
}
// export default UserSettings;
