import { h } from "preact";
import {
  Box,
  Button,
  Container,
  Divider,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../util/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field, Form, Formik } from "formik";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";

export default function UserProfile() {
  const submittedToast = useToast();
  const [user, userLoading] = useAuthState(auth);

  const docRef = doc(db, "user", user!.uid); // bang
  const [value, loading, error, snapshot] = useDocumentData(docRef);

  const submitHandler = async (values: any) => {
    // remove undefined's from values
    Object.keys(values).forEach((key) =>
      values[key] === undefined ? delete values[key] : {}
    );

    await updateDoc(docRef, values);

    // show submitted toast
    submittedToast({
      title: "Profile Updated",
      description: "Your profile properties have changed",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    history.back();
  };

  return (
    <Container>
      <FadeInSlideRight>
        <Heading as="h3" color="blue.400" w="100%" mt={2} pb={3}>
          Profile
        </Heading>
      </FadeInSlideRight>

      <FadeIn>
        <Box mx={4}>
          <Formik
            enableReinitialize
            initialValues={{
              nickname: value?.displayName,
              firstname: value?.firstname,
              lastname: value?.lastname,
              email: value?.email,
              photoURL: value?.photoURL,
              phoneNumber: value?.phoneNumber,
            }}
            onSubmit={submitHandler}
          >
            <Form>
              <FormLabel htmlFor="nickname">Nickname</FormLabel>
              <Field name="nickname" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="firstname">First name</FormLabel>
              <Field name="firstname" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="lastname">Last name</FormLabel>
              <Field name="lastname" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="email">Email</FormLabel>
              <Field name="email" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="phoneNumber">Phone</FormLabel>
              <Field name="phoneNumber" as={Input} />

              <Divider my={3} />

              <FormLabel htmlFor="photoURL">Avatar url</FormLabel>
              <Field name="photoURL" as={Input} />

              <Divider my={3} />

              <Button type="submit" colorScheme="blue" w="100%" my={4}>
                Submit
              </Button>
            </Form>
          </Formik>
        </Box>
      </FadeIn>
    </Container>
  );
}
// export default UserProfile;
