import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SlideFade,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { h } from "preact";
import { Fragment, useState } from "react";
import {
  useCollection,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { FadeIn } from "../../components/animations/FadeSlide";
import PriBtn from "../../components/generic/PriBtn";
import ToolIconButton from "../../components/generic/ToolIconButton";
import PageHead from "../../components/page/pageHead";
import { auth, db } from "../../util/firebase-config";

import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { route } from "preact-router";
import { useAuthState } from "react-firebase-hooks/auth";
import FollowButtons from "../../components/generic/FollowButtons";
import { addOrganization } from "../organizations/addOrganization";
import { SiteListButtons } from "../../components/generic/SiteList/SiteListButtons";
import useStorage from "../../hooks/useStorage";

export default function UserProfile({ setHeaderTitle }) {
  setHeaderTitle("Profile");
  const { isOpen, onToggle, onOpen } = useDisclosure();
  if (!window) {
    // setUserHasScrolled(true);
    onOpen();
  } else {
    window.onscroll = function () {
      // setUserHasScrolled(true);
      onOpen();
    };
  }
  const [user] = useAuthState(auth);
  if (!user) return;
  const submittedToast = useToast();

  const docRef = doc(db, "user", user!.uid); // bang
  const [userData] = useDocumentData(docRef);

  const [orgsId, setOrgsId] = useStorage("orgs");
  const deleteSeriesDisclosure = useDisclosure();

  // console.log("userData ", userData);

  const orgsRef = collection(db, "organizations");
  const userOrgs = query(orgsRef, where("__owner", "==", user?.uid));
  const [orgs, orgsLoading] = useCollection(userOrgs);

  const followOrgsRef = collection(db, "followOrgs");
  const userFollowOrgs = query(followOrgsRef, where("userId", "==", user?.uid));
  const [followOrgs, followingOrgsLoading] = useCollection(userFollowOrgs);

  const getFollowing = () => {
    const items = followOrgs?.docs.map((follow) => {
      const docRef = doc(orgsRef, follow.data().followId);
      const [item] = useDocument(docRef);
      return { org: { ...item?.data() }, id: docRef.id };
    });
    if (items) return items;
    return [];
  };

  // console.log("orgs ", orgs?.docs);

  //
  // This is for the search bar
  //
  // const [searchString, setSearchString] = useState<string>("");
  // const debouncedValue = useDebounce<string>(searchString, 500);
  // const [searchItems, setSearchItems] = useState<QuerySnapshot<DocumentData>>();
  // useEffect(() => {
  //   console.log("searchString ", searchString);
  //   (async () => {
  //     const search = query(
  //       orgsRef,
  //       where("orgName", "array-contains", debouncedValue)
  //     );
  //     const docs = await getDocs(search);
  //     setSearchItems(docs);
  //   })();
  // }, [debouncedValue]);

  const submitHandler = async (values: any) => {
    // remove undefined's from values
    console.log("values ", values);

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

  // const searchOrgs = (e) => {
  //   // console.log("e ", e.target.value);
  //   setSearchString(e.target.value);
  // };

  return (
    <Fragment>
      <PageHead title={userData?.displayName}>
        <Image
          src={userData?.photoURL ? userData?.photoURL : ""}
          alt={userData?.displayName}
          boxSize="50px"
          border="1px solid"
          borderColor={useColorModeValue("blue.600", "blue.300")}
          borderRadius={"50%"}
          cursor="pointer"
          onClick={() => {
            console.log("id: ", userData?.uid);
          }}
        />
      </PageHead>

      <FadeIn>
        <Box my={4}>
          <Formik
            enableReinitialize
            initialValues={{
              nickname: userData?.displayName,
              firstname: userData?.firstname,
              lastname: userData?.lastname,
              email: userData?.email,
              privateEmail: userData?.privateEmail,
              photoURL: userData?.photoURL,
              phoneNumber: userData?.phoneNumber,
            }}
            onSubmit={submitHandler}
          >
            {({
              isSubmitting,
              getFieldProps,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form>
                <Accordion defaultIndex={[1]} mb={16}>
                  {/* /////////////////////////////
                  // Personal
                ////////////////*/}
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
                      <Text fontSize="xs" color="gray.300" align="right">
                        id: {userData?.uid}
                      </Text>
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
                      <Flex gap={2} alignItems="center">
                        <Field name="email" as={Input} />
                        <FormLabel htmlFor="privateEmail" fontSize="xs" m={0}>
                          Private
                        </FormLabel>
                        <Checkbox name="privateEmail" m={0} />
                      </Flex>

                      <Divider my={3} />

                      <FormLabel htmlFor="phoneNumber">Phone</FormLabel>
                      <Field name="phoneNumber" as={Input} />

                      <Divider my={3} />
                      <Flex
                        justifyContent={"space-between"}
                        alignItems="center"
                        gap={4}
                      >
                        <Box w="full">
                          <FormLabel htmlFor="photoURL">Avatar url</FormLabel>
                          <Field name="photoURL" as={Input} />
                        </Box>
                        <Image
                          src={userData?.photoURL ? userData?.photoURL : ""}
                          alt={userData?.displayName}
                          boxSize="55px"
                          border="1px solid"
                          borderColor={useColorModeValue(
                            "blue.600",
                            "blue.300"
                          )}
                          borderRadius={"50%"}
                        />
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                  {/* /////////////////////////////
                  // Associations
                ////////////////*/}
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
                            onChange={() => {}}
                          />
                        </InputGroup>
                        <ToolIconButton
                          aria-label="add Organization"
                          icon={AddToPhotosOutlinedIcon}
                          onClick={() => {
                            addOrganization(user?.uid);
                          }}
                        />
                      </Flex>
                      {/* <VStack>
                      {searchItems?.docs.map((hit) => (
                        <Box>{hit.data().orgName}</Box>
                      ))}
                    </VStack> */}

                      <Divider my={4} />

                      {!orgsLoading && orgs && orgs.docs.length > 0 && (
                        <Fragment>
                          <Heading size={"md"} mb={2} color={"blue.400"}>
                            Your Organizations
                          </Heading>
                          <Divider mb={2} />
                          <VStack align={"left"}>
                            {orgs?.docs.map((org) => (
                              <Flex
                                p={2}
                                pr={4}
                                justifyContent={"space-between"}
                                _hover={{
                                  background: "blue.100",
                                }}
                              >
                                <Box
                                  cursor="pointer"
                                  onClick={() => {
                                    // view organization from db
                                    route(`/organization/${org.id}`);
                                  }}
                                >
                                  <Flex alignItems="center">
                                    <Text cursor="pointer">
                                      {org.data().orgName}
                                    </Text>
                                    {!org.data().__public && (
                                      <Badge
                                        ml={4}
                                        colorScheme="red"
                                        variant="outline"
                                      >
                                        Private
                                      </Badge>
                                    )}
                                  </Flex>
                                </Box>
                                {/* <Flex gap={2}>
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
                                  // onClick={() => {}}
                                />
                              </Flex> */}
                                <SiteListButtons
                                  setStorage={setOrgsId}
                                  item={org}
                                  listType="organization"
                                  disclosure={deleteSeriesDisclosure}
                                >
                                  <Box>
                                    This will delete the organization and is not
                                    undo-able
                                  </Box>
                                  <Box>
                                    You will loose any work you have done with
                                    this Organization
                                  </Box>
                                </SiteListButtons>
                              </Flex>
                            ))}
                          </VStack>
                        </Fragment>
                      )}

                      {getFollowing().length > 0 && (
                        <Fragment>
                          <Heading size={"md"} my={2} mt={4} color={"blue.400"}>
                            Following
                          </Heading>
                          <Divider mb={2} />
                          <VStack align={"left"}>
                            {getFollowing()?.map((org) => (
                              <Flex
                                p={2}
                                pr={4}
                                justifyContent={"space-between"}
                                alignItems="center"
                                _hover={{
                                  background: "blue.100",
                                }}
                              >
                                <Box
                                  w="full"
                                  cursor="pointer"
                                  onClick={() => {
                                    route(`/organization/${org?.id}`);
                                  }}
                                >
                                  <Text fontSize="md">{org?.org.orgName}</Text>
                                </Box>

                                <FollowButtons
                                  user={user}
                                  data={org as any}
                                  variant="ghost"
                                  colName="followOrgs"
                                />
                              </Flex>
                            ))}
                          </VStack>
                        </Fragment>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <SlideFade in={isOpen} offsetX="20px">
                  <Box m={4} position="fixed" bottom={0} right={0}>
                    <PriBtn
                      type="submit"
                      px={8}
                      leftIcon={(<SaveOutlinedIcon />) as any}
                      borderRadius="full"
                      isLoading={isSubmitting}
                      loadingText="Saving"
                    >
                      Save
                    </PriBtn>
                  </Box>
                </SlideFade>
              </Form>
            )}
          </Formik>
        </Box>
      </FadeIn>
    </Fragment>
  );
}
