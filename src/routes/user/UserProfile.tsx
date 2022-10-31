import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  useToast,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { h } from "preact";
import { Fragment, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import {
  FadeIn,
  FadeInSlideRight,
} from "../../components/animations/FadeSlide";
import PriBtn from "../../components/generic/PriBtn";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
import { auth, db } from "../../util/firebase-config";

import EditIcon from "@mui/icons-material/Edit";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { addOrganization } from "../organizations/addOrganization";
import { route } from "preact-router";
import useDebounce from "../../hooks/useDebounce";
import { useEffect } from "preact/hooks";

export default function UserProfile({ setHeaderTitle, user }) {
  setHeaderTitle("Profile");
  const submittedToast = useToast();
  // const [user, userLoading] = useAuthState(auth);
  // console.log("user ", user.uid);

  const docRef = doc(db, "user", user!.uid); // bang
  const [value] = useDocumentData(docRef);

  const orgsRef = collection(db, "organizations");
  const userOrgs = query(orgsRef, where("__owner", "==", user?.uid));
  const [orgs, orgsLoading] = useCollection(userOrgs);

  // console.log("orgs ", orgs?.docs);

  const [searchString, setSearchString] = useState<string>("");
  const debouncedValue = useDebounce<string>(searchString, 500);
  const [searchItems, setSearchItems] = useState<QuerySnapshot<DocumentData>>();
  useEffect(() => {
    console.log("searchString ", searchString);
    (async () => {
      const search = query(
        orgsRef,
        where("orgName", "array-contains", debouncedValue)
      );
      const docs = await getDocs(search);
      setSearchItems(docs);
    })();
  }, [debouncedValue]);

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

  const searchOrgs = (e) => {
    // console.log("e ", e.target.value);
    setSearchString(e.target.value);
  };

  return (
    <Fragment>
      <PageHead title={value?.displayName}>
        <Image
          src={value?.photoURL ? value?.photoURL : ""}
          alt={value?.displayName}
          boxSize="50px"
          border="1px solid"
          borderColor={useColorModeValue("blue.600", "blue.300")}
          borderRadius={"50%"}
        />
      </PageHead>

      <FadeIn>
        <Box my={4}>
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
              <Accordion defaultIndex={[1]}>
                <AccordionItem border="0px">
                  <AccordionButton
                    bgGradient="linear(to-r, whiteAlpha.100, blue.300)"
                    borderBottomRightRadius={15}
                    boxShadow={"md"}
                    _hover={{
                      bgGradient: "linear(to-r, whiteAlpha.100, blue.400)",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Personal Info
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
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
                    <Flex
                      justifyContent={"space-between"}
                      alignItems="center"
                      gap={4}
                    >
                      <FormLabel htmlFor="photoURL">Avatar url</FormLabel>
                      <Field name="photoURL" as={Input} />
                      <Image
                        src={value?.photoURL ? value?.photoURL : ""}
                        alt={value?.displayName}
                        boxSize="45px"
                        border="1px solid"
                        borderColor={useColorModeValue("blue.600", "blue.300")}
                        borderRadius={"50%"}
                      />
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>

                <AccordionItem mt={2} border="0px">
                  <AccordionButton
                    bgGradient="linear(to-r, whiteAlpha.100, blue.300)"
                    borderBottomRightRadius={15}
                    boxShadow={"md"}
                    _hover={{
                      bgGradient: "linear(to-r, whiteAlpha.100, blue.400)",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    <Box flex="1" textAlign="left">
                      Associations
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    <FormLabel htmlFor="search" mt={2}>
                      Add Organization
                    </FormLabel>
                    <Flex gap={2}>
                      {/* <Input name="search" /> */}
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          children={<Icon as={SearchIcon} />}
                        />
                        <Input
                          placeholder="Find Organization"
                          onChange={searchOrgs}
                        />
                      </InputGroup>
                      <ToolIconButton
                        aria-label="add Organization"
                        icon={AddToPhotosOutlinedIcon}
                        onClick={() => {
                          user && addOrganization(user);
                        }}
                      />
                    </Flex>
                    <VStack>
                      {searchItems?.docs.map((hit) => (
                        <Box>{hit.data().orgName}</Box>
                      ))}
                    </VStack>

                    <Divider my={4} />
                    <Heading size={"md"} mb={2} color={"blue.400"}>
                      Your Organizations
                    </Heading>
                    <Divider mb={2} />
                    <VStack align={"left"}>
                      {!orgsLoading &&
                        orgs?.docs.map((org) => (
                          <Flex
                            p={2}
                            pr={4}
                            justifyContent={"space-between"}
                            _hover={{
                              background: "blue.100",
                            }}
                            onClick={() => {
                              // view organization from db
                              route(`/organization/${org.id}`);
                            }}
                          >
                            <Text fontSize="md">{org.data().orgName}</Text>
                            <Flex gap={2}>
                              <ToolIconButton
                                aria-label="Edit Organization"
                                icon={EditIcon}
                                size="xs"
                                variant="ghost"
                                onClick={() => {
                                  route(`/organization/edit/${org.id}`);
                                }}
                              />
                              <ToolIconButton
                                aria-label="Remove Organization"
                                icon={CloseIcon}
                                size="xs"
                                variant="ghost"
                                onClick={() => {}}
                              />
                            </Flex>
                          </Flex>
                        ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Divider my={3} />

              <PriBtn type="submit" w="100%" my={2} mb={4}>
                Submit
              </PriBtn>
            </Form>
          </Formik>
        </Box>
      </FadeIn>
    </Fragment>
  );
}
