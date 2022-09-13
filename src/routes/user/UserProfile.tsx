import {
  Box,
  Divider,
  Flex,
  Heading,
  Button,
  Input,
  FormLabel,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { h } from "preact";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../util/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Field, Form, Formik } from "formik";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import { Image } from "@chakra-ui/react";
import { Fragment } from "react";

export default function UserProfile() {
  const submittedToast = useToast();
  const [user] = useAuthState(auth);

  const docRef = doc(db, "user", user!.uid); // bang
  const [value] = useDocumentData(docRef);

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
    <Fragment>
      <FadeInSlideRight>
        <Heading color="blue.400" fontSize={"4xl"} mx={4} my={2}>
          Profile
        </Heading>
      </FadeInSlideRight>
      <Divider border={4} />
      <FadeIn>
        <Box mx={8} my={4}>
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
              <Flex justifyContent={"space-between"}>
                <Box w="100%" mr={4}>
                  <FormLabel htmlFor="nickname">Nickname</FormLabel>
                  <Field name="nickname" as={Input} />
                </Box>
                <Image
                  src={value?.photoURL ? value?.photoURL : ""}
                  alt="Dan Abramov"
                  boxSize="85px"
                  border="1px solid"
                  borderColor={useColorModeValue("blue.600", "blue.300")}
                  borderRadius={"50%"}
                />
              </Flex>

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
    </Fragment>
  );
}
// export default UserProfile;
